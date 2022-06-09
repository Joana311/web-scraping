import { User } from "@prisma/client";
import { EventEmitter } from "events";

interface UserEvents {
  get_by_id: (user_id: string) => User;
  get_by_name: (username: string) => User;
}

