// Типы для игры "Ограбление Банка"

export type UserRole = "guest" | "player" | "host" | "admin";

export type GamePhase =
  | "roleReveal"
  | "planning"
  | "action"
  | "discussion"
  | "voting"
  | "results";

export type RoomStatus = "waiting" | "playing" | "finished";

export type PlayerStatus = "alive" | "eliminated";

export type GameRole = "Грабитель" | "Полицейский" | "Охранник" | "Заложник";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface Room {
  id: number;
  name: string;
  host: string;
  hostId: number;
  players: number;
  maxPlayers: number;
  status: RoomStatus;
  isPrivate: boolean;
  password?: string;
  createdAt: Date;
}

export interface Player {
  id: number;
  userId: number;
  name: string;
  role?: GameRole;
  avatar: string;
  status: PlayerStatus;
  ready: boolean;
  isHost: boolean;
}

export interface GameSettings {
  playerCount: number;
  roundTime: number;
  roles: number;
  discussionTime: number;
}

export interface ChatMessage {
  id: number;
  author: string;
  authorId?: number;
  text: string;
  time: string;
  isSystem?: boolean;
}

export interface GameState {
  roomId: number;
  phase: GamePhase;
  round: number;
  timeLeft: number;
  players: Player[];
  settings: GameSettings;
}
