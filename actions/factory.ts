"use server";

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";
import * as z from "zod";

const factorySchema = z.object({
  name: z.string().min(4),
  description: z.string().optional(),
})

type factorySchemaType = z.infer<typeof factorySchema>;


class UserNotFoundErr extends Error {}

export async function GetAllFactoriesStat() {
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

export async function CreateFactory(data: factorySchemaType){
  const validation = factorySchema.safeParse(data);
  if (!validation.success) {
    throw new Error("factory not valid");
  }

  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  const { name, description } = data;

  const factory = await prisma.receiptFactory.create({
    data: {
      userId: user.id,
      name,
      description,
    },
  });

  if (!factory) {
    throw new Error("something went wrong");
  }

  return factory.id;
}

export async function GetAllFactories(){
  const user = await currentUser();
  if(!user){
    throw new UserNotFoundErr();
  }

  return await prisma.receiptFactory.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export async function GetFactoryById(id: number){
  const user = await currentUser();

  if(!user){
    throw new UserNotFoundErr();
  }

  return await prisma.receiptFactory.findUnique({
    where: {
      userId: user.id,
      id,
    },
  });

}

export async function UpdateFactoryContent(id: number, jsonContent: string){
  const user = await currentUser();

  if(!user){
    throw new UserNotFoundErr();
  }

  return await prisma.receiptFactory.update({
    where: {
      userId: user.id,
      id,
    },
    data: {
      content: jsonContent
    }
  })
}

export async function PublishFactory(id: number) {
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }

  return await prisma.receiptFactory.update({
    data: {
      published: true,
    },
    where: {
      userId: user.id,
      id,
    },
  });
}

export async function GetFactoryContentByUrl(factoryUrl: string){
  const user = await currentUser();
  if (!user) {
    throw new UserNotFoundErr();
  }
  return await prisma.receiptFactory.update({
    select: {
      content: true,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
    where: {
      shareURL: factoryUrl,
    },
  });
}