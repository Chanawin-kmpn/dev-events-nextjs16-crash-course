import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { IEvent } from "@/database/event.model";
import { events } from "@/lib/constants";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const Home = async () => {
	"use cache";
	cacheLife("hours");
	const response = await fetch(`${BASE_URL}/api/events`);

	const { events } = await response.json();

	return (
		<section>
			<h1 className="text-center">
				The Hub for Every Dev <br /> Event You Can&apos;t Miss
			</h1>
			<p className="mt-5 text-center">
				Hackathons, Meetups, and Conference, All in One Place
			</p>
			<ExploreBtn />

			<div className="space-y-7 mt-20">
				<h3>Featured Events</h3>

				<ul className="events">
					{events &&
						events.length > 0 &&
						events.map((event: IEvent) => (
							<li key={event.title} className="list-none">
								<EventCard {...event} />
							</li>
						))}
				</ul>
			</div>
		</section>
	);
};

export default Home;
