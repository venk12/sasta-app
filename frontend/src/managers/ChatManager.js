// import {UserMessage, AIMessage, HelperMessage} from "../components/MessageTypes/MessageClasses";


class ChatManager {
    constructor() {
      this.messages = [];
    }
  
    addMessage(newMessage) {
      this.messages.push(newMessage)
    }
  
    getMessages() {
      return this.messages;
    }
  
    clearMessages() {
      this.messages = [];
    }

    // getSampleMessages() {
    //     return [
    //         new UserMessage('Hello, I need help with pronunciation.'),
    //         new AIMessage("Of course! I'd be happy to help. What word or phrase are you struggling with?"),
    //         new UserMessage('Can you help me pronounce "pronunciation"?'),
    //         new AIMessage('Great! The word "pronunciation" is pronounced as "pruh-nuhn-see-ey-shuhn". Let\'s break it down...'),
    //         new AIMessage("Of course! I'd be happy to help. What word or phrase are you struggling with?"),
    //     ];
    // }
  }
  
  export default ChatManager;