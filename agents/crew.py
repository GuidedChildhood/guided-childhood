"""CrewAI Crew definition for Guided Childhood — all 8 agents.

This module builds the agents and tasks from the YAML configs, wires up the
inter-agent context dependencies, and exposes factory functions for the daily
(sequential) and weekly (hierarchical) crews.

LLM: Claude via CrewAI's LLM class (model anthropic/claude-opus-4-8).
"""

from __future__ import annotations

import os
from datetime import date
from pathlib import Path

import yaml
from crewai import LLM, Agent, Crew, Process, Task

from .tools import (
    web_search_tool,
    file_read_tool,
    file_write_tool,
    send_email_tool,
)

BASE_DIR = Path(__file__).resolve().parent
CONFIG_DIR = BASE_DIR / "config"


# --------------------------------------------------------------------------- #
# Config loading
# --------------------------------------------------------------------------- #
def _load_yaml(name: str) -> dict:
    with open(CONFIG_DIR / name, "r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


AGENTS_CFG = _load_yaml("agents.yaml")
TASKS_CFG = _load_yaml("tasks.yaml")


# --------------------------------------------------------------------------- #
# LLM
# --------------------------------------------------------------------------- #
def build_llm() -> LLM:
    """Build the Claude LLM. API key is read from the environment only.

    Using the 'anthropic/' prefix forces LiteLLM to route to Anthropic
    regardless of whether the model name is in its built-in model registry.
    """
    return LLM(
        model="anthropic/claude-opus-4-8",
        api_key=os.getenv("ANTHROPIC_API_KEY"),
        temperature=0.6,
    )


# --------------------------------------------------------------------------- #
# Shared tool instances
# --------------------------------------------------------------------------- #
search_tool = web_search_tool
file_read = file_read_tool
file_write = file_write_tool
email_tool = send_email_tool


# --------------------------------------------------------------------------- #
# Agent factory
# --------------------------------------------------------------------------- #
def _make_agent(key: str, llm: LLM, tools: list, allow_delegation: bool = False) -> Agent:
    cfg = AGENTS_CFG[key]
    return Agent(
        role=cfg["role"].strip(),
        goal=cfg["goal"].strip(),
        backstory=cfg["backstory"].strip(),
        tools=tools,
        llm=llm,
        allow_delegation=allow_delegation,
        verbose=True,
        max_iter=8,
    )


def build_agents(llm: LLM | None = None) -> dict[str, Agent]:
    """Instantiate all eight agents keyed by their lowercase name."""
    llm = llm or build_llm()
    return {
        "navigator": _make_agent("navigator", llm, [search_tool]),
        "sage":      _make_agent("sage", llm, [search_tool, file_write]),
        "scout":     _make_agent("scout", llm, [search_tool]),
        "compass":   _make_agent("compass", llm, [file_read, file_write]),
        "herald":    _make_agent("herald", llm, [search_tool]),
        "guardian":  _make_agent("guardian", llm, [search_tool]),
        "diego":     _make_agent("diego", llm, [search_tool, file_read, file_write]),
        # Pulse can delegate so it can chair the hierarchical weekly meeting.
        "pulse":     _make_agent(
            "pulse", llm, [email_tool, file_write], allow_delegation=True
        ),
    }


# --------------------------------------------------------------------------- #
# Task factory + context wiring
# --------------------------------------------------------------------------- #
def _fmt(text: str) -> str:
    return text.strip().replace("{date}", date.today().isoformat())


def build_daily_tasks(agents: dict[str, Agent]) -> dict[str, Task]:
    """Build the daily tasks and wire inter-agent context.

    Dependency graph (context flows downstream):
        scout ──┬─> sage      (news hook for educator post)
                ├─> diego     (research hook for viral series post + comment replies)
                ├─> herald    (pitch references the intelligence)
                └─> navigator (outreach can use timely hooks)
        guardian ─> navigator (safeguarding read informs outreach)
        sage ────> diego      (so Diego takes a different LinkedIn angle)
        all 7  ──> pulse      (compiles everything)
    """
    scout = Task(
        description=_fmt(TASKS_CFG["scout_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["scout_task"]["expected_output"]),
        agent=agents["scout"],
    )
    guardian = Task(
        description=_fmt(TASKS_CFG["guardian_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["guardian_task"]["expected_output"]),
        agent=agents["guardian"],
    )
    navigator = Task(
        description=_fmt(TASKS_CFG["navigator_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["navigator_task"]["expected_output"]),
        agent=agents["navigator"],
        context=[scout, guardian],
    )
    sage = Task(
        description=_fmt(TASKS_CFG["sage_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["sage_task"]["expected_output"]),
        agent=agents["sage"],
        context=[scout],
    )
    herald = Task(
        description=_fmt(TASKS_CFG["herald_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["herald_task"]["expected_output"]),
        agent=agents["herald"],
        context=[scout],
    )
    compass = Task(
        description=_fmt(TASKS_CFG["compass_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["compass_task"]["expected_output"]),
        agent=agents["compass"],
    )
    diego = Task(
        description=_fmt(TASKS_CFG["diego_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["diego_task"]["expected_output"]),
        agent=agents["diego"],
        context=[scout, sage],
    )
    pulse = Task(
        description=_fmt(TASKS_CFG["pulse_daily_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["pulse_daily_task"]["expected_output"]),
        agent=agents["pulse"],
        context=[scout, guardian, navigator, sage, herald, compass, diego],
    )
    return {
        "scout":     scout,
        "guardian":  guardian,
        "navigator": navigator,
        "sage":      sage,
        "herald":    herald,
        "compass":   compass,
        "diego":     diego,
        "pulse":     pulse,
    }


# --------------------------------------------------------------------------- #
# Crew factories
# --------------------------------------------------------------------------- #
# Daily execution order (sequential): Scout -> Guardian -> Navigator -> Sage
# -> Herald -> Compass -> Diego -> Pulse. Diego runs after Sage so he can read
# her post and take a different LinkedIn angle.
DAILY_ORDER = ["scout", "guardian", "navigator", "sage", "herald", "compass", "diego", "pulse"]


def build_daily_crew(llm: LLM | None = None) -> tuple[Crew, dict[str, Task], dict[str, Agent]]:
    """Sequential daily-briefing crew. Returns (crew, tasks, agents)."""
    agents = build_agents(llm)
    tasks = build_daily_tasks(agents)
    crew = Crew(
        agents=[agents[k] for k in DAILY_ORDER],
        tasks=[tasks[k] for k in DAILY_ORDER],
        process=Process.sequential,
        verbose=True,
    )
    return crew, tasks, agents


def build_weekly_crew(llm: LLM | None = None) -> tuple[Crew, dict[str, Agent]]:
    """Hierarchical weekly meeting with Pulse as manager.

    In a hierarchical process the manager agent delegates to the workers, so
    information genuinely passes between agents as Pulse coordinates them.
    """
    llm = llm or build_llm()
    agents = build_agents(llm)

    manager = agents["pulse"]
    workers = ["scout", "guardian", "navigator", "sage", "herald", "compass", "diego"]

    weekly_task = Task(
        description=_fmt(TASKS_CFG["pulse_weekly_task"]["description"]),
        expected_output=_fmt(TASKS_CFG["pulse_weekly_task"]["expected_output"]),
        # No agent assigned: the manager decides delegation in hierarchical mode.
    )

    crew = Crew(
        agents=[agents[k] for k in workers],  # workers only; manager is separate
        tasks=[weekly_task],
        process=Process.hierarchical,
        manager_agent=manager,
        verbose=True,
    )
    return crew, agents
