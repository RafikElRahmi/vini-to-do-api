import Event from "@models/event";
import User from "@models/user";
import { decodeAccessToken } from "@utils/auth/api/token/decodeToken";
import { getToken, verifyExpires } from "@utils/auth/api/token/token";
import logError from "@utils/logger";
import { Request, Response } from "express";

export async function getAllEvents(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const events = await Event.find({ userId: user._id });
    const sortedEvents = events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    return res.status(200).send(sortedEvents);
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
export async function getOneEvent(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const {eventId} = req.params;
    const event = await Event.find({ _id: eventId});
    return res.status(200).send(event);
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
export async function createEvent(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { title, date } = req.body;
    if (!title || !date) {
      return res.status(400).send("Invalid form data");
    }
    const newEvent = {
      userId: user._id,
      date: new Date(date),
      title,
    };
    await Event.create(newEvent);
    const events = await Event.find({ userId: user._id });
       const sortedEvents = events.sort(
         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
       );
       return res.status(200).send(sortedEvents);
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
export async function updateEvent(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { title, date } = req.body;
    const { eventId } = req.params;
    if (!title || !date || !eventId) {
      return res.status(400).send("Invalid form data");
    }
    const newData = {
      userId: user._id,
      date: new Date(date),
      title,
    };
    await Event.findByIdAndUpdate(eventId, newData);
     const events = await Event.find({ userId: user._id });
        const sortedEvents = events.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        return res.status(200).send(sortedEvents);
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
export async function deleteEvent(req: Request, res: Response) {
  try {
    const { access_token } = await getToken(req);
    if (!access_token) {
      return res.status(401).send("false");
    }
    const access = await decodeAccessToken(access_token);
    const isExpired = verifyExpires(access.exp);
    if (isExpired) {
      return res.status(401).send("token expired");
    }
    const user = await User.findById(access.userId);
    if (!user) {
      return res.status(404).send("user not found");
    }
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).send("Invalid form data");
    }
    await Event.findByIdAndDelete(eventId);
     const events = await Event.find({ userId: user._id });
       const sortedEvents = events.sort(
         (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
       );
       return res.status(200).send(sortedEvents);
  } catch (error) {
    logError(`${error}`);
    return res.status(500).send("error occured");
  }
}
