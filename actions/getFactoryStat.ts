"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

class UserNotFoundErr extends Error {}

export async function GetFactoryStat() {
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  const stats = await prisma.receiptFactory.aggregate({
    where: {
      userId: user.id,
    },
    _sum: {
      visits: true,
      prints: true,
    }
  })

  const visits = stats._sum.visits || 0;
  const prints = stats._sum.prints || 0;

  let printRate = 0;
  let bounceRate = 0;

  return {
    visits, prints, printRate, bounceRate
  }
}

