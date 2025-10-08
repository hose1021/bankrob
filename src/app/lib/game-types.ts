// Игровые типы для "Ограбление Банка"

export type PlayerRole = "robber" | "client";
export type CardType = "main" | "additional";

export interface Card {
  id: string;
  type: CardType;
  value?: number; // Цифра кода (0-9)
  position?: number; // Порядковый номер в коде (римские цифры I, II, III, ...)
  isRobber?: boolean; // Карта грабителя
}

export interface GamePlayer {
  id: number;
  name: string;
  role: PlayerRole;
  mainCard: Card;
  additionalCards: Card[];
  isAlive: boolean;
  isReady: boolean;
}

export interface CodeAttempt {
  digit: number;
  position: number;
}

export interface BankCode {
  digits: Map<number, number>; // position -> digit
  revealed: Set<number>; // раскрытые позиции
}

export type GamePhase =
  | "setup" // Начальная настройка
  | "card-exchange" // Обмен картами
  | "card-discard" // Сброс карты
  | "night" // Ночь - грабители
  | "day" // День - обсуждение
  | "voting" // Голосование
  | "night-result" // Результат ночи
  | "day-result" // Результат дня
  | "game-over"; // Конец игры

export interface ExchangeOffer {
  fromPlayerId: number;
  toPlayerId: number;
  cardId: string;
  status: "pending" | "accepted" | "rejected";
}

export interface VoteResult {
  playerId: number;
  votes: number;
}

export interface GameState {
  phase: GamePhase;
  round: number;
  players: GamePlayer[];
  bankCode: BankCode;
  discardedCards: Card[];
  currentExchanges: ExchangeOffer[];
  nightAttempts: CodeAttempt[];
  dayVotes: Map<number, number>; // voterId -> targetId
  eliminatedPlayers: number[];
  winner?: "robbers" | "clients";
  phaseTimer: number;
}
