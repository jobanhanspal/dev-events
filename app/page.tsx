
import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database";
import { cacheLife } from "next/cache";
import { Suspense } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function EventsList() {
  const response = await fetch(`${BASE_URL}/api/events`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch events");
  }

  const { events }: { events: IEvent[] } = await response.json();

  return (
    <ul className="events list-none">
      {events.map((event) => (
        <li key={event.slug}>
          <EventCard
            title={event.title}
            image={event.image}
            slug={event.slug}
            location={event.location}
            date={event.date}
            time={event.time}
          />
        </li>
      ))}
    </ul>
  );
}

const Page = async () => {
  'use cache'
  cacheLife('hours')
  return (
    <section>
      <h1 className="text-center">
        The hub for Every Dev
        <br />
        Event You Mustn't Miss
      </h1>

      <p className="text-center mt-5">
        Hackathons, Meetups, and conferences, All in One Place
      </p>

      <ExploreBtn />
      
      <div className="mt-20 space-y-7 scroll-mt-24" id="events">
        <h3>Featured Events</h3>

        <Suspense fallback={<p>Loading events...</p>}>
          <EventsList />
        </Suspense>
      </div>
    </section>
  );
};

export default Page;
