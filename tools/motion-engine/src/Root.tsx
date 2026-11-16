import React from 'react'
import { Composition } from 'remotion'
import { ResearchCard } from './ResearchCard'
import { DEMO_SPEC, type StorySpec } from './spec'
import { FORMAT } from './theme'

export const RemotionRoot: React.FC = () => (
  <Composition
    id="ResearchCard"
    component={ResearchCard as unknown as React.FC<Record<string, unknown>>}
    width={FORMAT.width}
    height={FORMAT.height}
    fps={FORMAT.fps}
    durationInFrames={FORMAT.durationInFrames}
    defaultProps={{ spec: DEMO_SPEC }}
    calculateMetadata={({ props }) => {
      const spec = (props as { spec: StorySpec }).spec
      const seconds = Math.min(18, Math.max(12, spec.durationSeconds ?? 14))
      return { durationInFrames: Math.round(seconds * FORMAT.fps) }
    }}
  />
)
