import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000';

class SocketService {
  public socket: Socket | null = null;
  private currentMeetupId: string | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(API_BASE_URL, {
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      this.socket.on('connect', () => {
        console.log('Socket connected:', this.socket?.id);
        if (this.currentMeetupId) {
          this.joinMeetupRoom(this.currentMeetupId);
        }
      });

      this.socket.on('disconnect', () => {
        console.log('Socket disconnected');
      });
    }
    return this.socket;
  }

  joinMeetupRoom(meetupId: string) {
    if (!this.socket) this.connect();

    // Attempt to leave previous room if different
    if (this.currentMeetupId && this.currentMeetupId !== meetupId) {
      this.socket?.emit('leave_meetup_room', this.currentMeetupId);
    }

    this.currentMeetupId = meetupId;
    this.socket?.emit('join_meetup_room', meetupId);
    console.log(`Joined meetup socket room: ${meetupId}`);
  }

  leaveMeetupRoom() {
    if (this.socket && this.currentMeetupId) {
      this.socket.emit('leave_meetup_room', this.currentMeetupId);
      this.currentMeetupId = null;
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentMeetupId = null;
    }
  }

  // --- Emit Events ---

  sendMessage(data: { _id?: string; meetupId: string; userId: string; userName: string; message: string; type?: string; billData?: any; paymentData?: any; createdAt?: Date | string }) {
    this.socket?.emit('send_message', data);
  }

  emitVoteUpdate(data: { meetupId: string; votes: any[]; voteCounts: Record<string, number>; selectedCafe: any; status: string }) {
    this.socket?.emit('vote_update', data);
  }

  emitOrderUpdate(data: { meetupId: string; userId: string; userName: string; items: any[]; total: number }) {
    this.socket?.emit('order_update', data);
  }

  // --- Cafe Dashboard Methods ---

  private currentCafeId: string | null = null;

  joinCafeRoom(cafeId: string) {
    if (!this.socket) this.connect();
    if (this.currentCafeId && this.currentCafeId !== cafeId) {
      this.socket?.emit('leave_cafe_room', this.currentCafeId);
    }
    this.currentCafeId = cafeId;
    this.socket?.emit('join_cafe_room', cafeId);
    console.log(`Joined cafe socket room: cafe_${cafeId}`);
  }

  leaveCafeRoom() {
    if (this.socket && this.currentCafeId) {
      this.socket.emit('leave_cafe_room', this.currentCafeId);
      this.currentCafeId = null;
    }
  }

  emitOrderCreated(data: any) {
    this.socket?.emit('order-created', data);
  }
}

export const socketService = new SocketService();
export default socketService;
