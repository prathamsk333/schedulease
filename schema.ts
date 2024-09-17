export interface Schema {
  users: {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    token: string;
  };

  appointments: {
    _id: string;
    admins: string[];
    participants: string[];
    maxParticipants: number;
    registrationCloses: Date;
    createdAt: Date;
    startTime: Date;
    endTime: Date;
    title: string;
    desc: string;
    category: "education" | "health" | "work" | "personal";
    mode: "online" | "offline";
    location: string;
    cancelled: boolean;
    cancelReason: string;
    paid: boolean;
    public: boolean; // Whether the appointment is listed on the public search page
  };
}
