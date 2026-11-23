'use client'

import Image from "next/image"
import posthog from "posthog-js"

const ExploreBtn = () => {
  const handleExplore = () => {
    posthog.capture("events_explored")
    posthog.logger.info("featured events exploration started", {
      interaction: "events_explored",
    })
    alert("hello")
  }

  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto">
        <a href="#events">Explore Events
            <Image src="icons/arrow-down.svg" alt="arrow-down" width={24} height={24} />
        </a>
    </button>
  )
}

export default ExploreBtn