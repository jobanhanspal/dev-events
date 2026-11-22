"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";

interface props{
    title: string;
    image: string;
    slug: string;
    location: string;
    date: string;
    time: string;
}
const EventCard = ({title, image, slug, location, date, time}: props) => {
  return (
    <div>
        <Link
          href={`/events/${slug}`}
          id="event-card"
          onClick={() => {
            posthog.capture("event_selected", { event_slug: slug })
            posthog.logger.info("featured event opened", {
              event_slug: slug,
              interaction: "event_selected",
            })
          }}
        >
            <Image src={image} alt={title} width={410} height={300} className="poster" />
            <div className="flex flex-row gap-2">
                <Image src="/icons/pin.svg" alt={location} height={14} width={14} />
                <p>{location}</p>
            </div>
            <p className="title">{title}</p>

            <div className="datetime">
                <div>
                <Image src="/icons/calendar.svg" alt="date" height={14} width={14} />
                <p>{date}</p>
                </div>
                <div>
                <Image src="/icons/clock.svg" alt="date" height={14} width={14} />
                <p>{time}</p>
                </div>
            </div>
        </Link>
    </div>
  )
}

export default EventCard