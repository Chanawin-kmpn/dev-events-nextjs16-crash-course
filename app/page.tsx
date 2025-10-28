import EventCard from "@/components/EventCard";
import ExploreBtn from "@/components/ExploreBtn";
import { events } from "@/lib/constants";

const Home = () => {
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
					{events.map((event) => (
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
