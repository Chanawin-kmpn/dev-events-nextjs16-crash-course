import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.action";
import { notFound } from "next/navigation";
import React from "react";
import BookEvent from "./BookEvent";
import EventCard from "./EventCard";
import Image from "next/image";
import { cacheLife } from "next/cache";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({
	icon,
	alt,
	label,
}: {
	icon: string;
	alt: string;
	label: string;
}) => {
	return (
		<div className="flex-row-gap-2 items-center">
			<Image src={icon} alt={alt} width={17} height={17} />
			<p>{label}</p>
		</div>
	);
};

const EventAgenda = ({ agendaItems }: { agendaItems: string[] }) => {
	return (
		<div className="agenda">
			<h2>Agenda</h2>
			<ul>
				{agendaItems.map((item) => (
					<li key={item}>{item}</li>
				))}
			</ul>
		</div>
	);
};

const EventTags = ({ tags }: { tags: string[] }) => (
	<div className="flex flex-row flex-wrap gap-1.5">
		{tags.map((tag) => (
			<div className="pill" key={tag}>
				{tag}
			</div>
		))}
	</div>
);

const EventDetails = async ({ params }: { params: Promise<string> }) => {
	"use cache";
	cacheLife("hours");
	let event;
	const slug = await params;

	try {
		const request = await fetch(`${BASE_URL}/api/events/${slug}`, {
			next: { revalidate: 60 },
		});

		if (!request.ok) {
			if (request.status === 400) {
				return notFound();
			}
			throw new Error(`Failed to fetch event: ${request.statusText}`);
		}

		const response = await request.json();
		event = response.event;

		if (!event) {
			return notFound();
		}
	} catch (error) {
		console.error("Error fetching event:", error);
		return notFound();
	}

	const {
		description,
		image,
		overview,
		date,
		time,
		location,
		mode,
		agenda,
		audience,
		tags,
		organizer,
	} = event;

	const booking = 10;

	const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);
	return (
		<section id="event">
			<div className="header">
				<h1>Event Description</h1>
				<p>{description}</p>
			</div>

			<div className="details">
				{/* Left Side - Event Content */}
				<div className="content">
					<Image
						src={image}
						alt="Event Banner"
						width={800}
						height={800}
						className="banner"
					/>

					<section className="flex-col-gap-2">
						<h2>Overview</h2>
						<p>{overview}</p>
					</section>

					<section className="flex-col-gap-2">
						<h2>Event Details</h2>

						<EventDetailItem
							icon="/icons/calendar.svg"
							alt="calendar"
							label={date}
						/>
						<EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
						<EventDetailItem icon="/icons/pin.svg" alt="pin" label={location} />
						<EventDetailItem icon="/icons/mode.svg" alt="mode" label={mode} />
						<EventDetailItem
							icon="/icons/audience.svg"
							alt="audience"
							label={audience}
						/>
					</section>

					<EventAgenda agendaItems={agenda} />

					<section className="flex-col-gap-2">
						<h2>About the Organizer</h2>
						<p>{organizer}</p>
					</section>

					<EventTags tags={tags} />
				</div>
				{/* Right Side - Event Content */}

				<aside className="booking">
					<div className="signup-card">
						<h2>Book Your Spot</h2>
						{booking > 0 ? (
							<p className="text-sm">
								Join {booking} people who have already booked their spot
							</p>
						) : (
							<p className="text-sm">Be the first to book your spot!</p>
						)}

						<BookEvent eventId={event._id} slug={slug} />
					</div>
				</aside>
			</div>

			<div className="flex flex-col gap-4 pt-20 w-full">
				<h2>Similar Events</h2>
				<div className="events">
					{similarEvents.length > 0 &&
						similarEvents.map((similarEvent: IEvent) => (
							<EventCard key={similarEvent.title} {...similarEvent} />
						))}
				</div>
			</div>
		</section>
	);
};

export default EventDetails;
