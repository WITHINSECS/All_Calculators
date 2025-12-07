import { NextResponse } from "next/server";
import AuthUser from "@/models/AuthUser";
import Inquiry from "@/models/Inquiry";
import { DBconnection } from "@/lib/db";

type ActivityPoint = {
  period: string;   // e.g. "2024-07"
  users: number;    // new users that month
  inquiries: number;// inquiries that month
};

type ActivityApiResponse = {
  success: boolean;
  data: ActivityPoint[];
  message?: string;
};



export async function GET() {
  await DBconnection();

  try {
    const months = 6;
    const now = new Date();

    // first day of the earliest month we want
    const from = new Date(now.getFullYear(), now.getMonth() - (months - 1), 1);

    const [userAgg, inquiryAgg] = await Promise.all([
      AuthUser.aggregate([
        { $match: { createdAt: { $gte: from } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" }, // "2024-07"
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Inquiry.aggregate([
        { $match: { createdAt: { $gte: from } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const usersMap = new Map<string, number>();
    (userAgg as { _id: string; count: number }[]).forEach((row) => {
      usersMap.set(row._id, row.count);
    });

    const inquiriesMap = new Map<string, number>();
    (inquiryAgg as { _id: string; count: number }[]).forEach((row) => {
      inquiriesMap.set(row._id, row.count);
    });

    // Build continuous months (even if some months have 0 docs)
    const data: ActivityPoint[] = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0"); // 01-12
      const key = `${year}-${month}`;

      data.push({
        period: key,
        users: usersMap.get(key) ?? 0,
        inquiries: inquiriesMap.get(key) ?? 0,
      });
    }

    const res: ActivityApiResponse = {
      success: true,
      data,
    };

    return NextResponse.json(res, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching activity data:", error);

    const res: ActivityApiResponse = {
      success: false,
      data: [],
      message:
        error instanceof Error ? error.message : "Unknown error fetching activity",
    };

    return NextResponse.json(res, { status: 500 });
  }
}
