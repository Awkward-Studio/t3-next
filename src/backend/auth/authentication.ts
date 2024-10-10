import { account } from "../client/appwriteClient";

export const loginUser = async (email: string, password: string) => {
    try {
      const sessionDetails = await account.createEmailPasswordSession(
        email,
        password
      );
      const userDetails = await account.get();
      return { userDetails, sessionDetails };
    } catch (error: any) {
      return console.log("Authentication error:", error);
    }
  };
  
  export const listSessions = async () => {
    try {
      const sessions = await account.listSessions();
      return sessions;
    } catch (error: any) {
      return console.log("Authentication error:", error);
    }
  };
  
  export const logoutUser = async () => {
    try {
      const result = await account.deleteSessions();
      return result;
    } catch (error: any) {
      return console.log("Authentication error:", error);
    }
  };
  
  export const getCurrentUser = async () => {
    try {
      const user = await account.get();
      return user;
    } catch (error: any) {
      return console.log("Authentication error:", error);
    }
  };