"use server";

import Event from "@/database/event.model";
import connectDB from "../mongodb";

export const getSimilarEventsBySlug = async (slug: string) => {
	try {
		await connectDB();

		const event = await Event.findOne({ slug });

		return await Event.find({
			_id: { $ne: event._id },
			tags: { $in: event.tags }, // หมายถึงไม่เอา event ที่มี id ตรงกับ event ปัจจุบัน และค้นหาEvent ที่มี tags ที่เหมือนกันกับ Event ปัจจุบัน
		}).lean();
	} catch (e) {
		return [];
	}
};
