/**
 * replay.ts
 * Replay stored shapes and events from storage
 */

export interface StoredEvent {
  timestamp: number;
  type: string;
  data: any;
}

export class EventReplayer {
  private events: StoredEvent[] = [];

  addEvent(event: StoredEvent): void {
    this.events.push(event);
  }

  getEvents(): StoredEvent[] {
    return this.events;
  }

  clearEvents(): void {
    this.events = [];
  }

  replayAt(timestamp: number, callback: (event: StoredEvent) => void): void {
    this.events
      .filter((event) => event.timestamp <= timestamp)
      .forEach(callback);
  }

  replayAll(callback: (event: StoredEvent) => void): void {
    this.events.forEach(callback);
  }

  exportEvents(): string {
    return JSON.stringify(this.events);
  }

  importEvents(json: string): void {
    this.events = JSON.parse(json);
  }
}
