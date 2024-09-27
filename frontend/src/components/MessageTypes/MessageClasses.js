// MessageClasses.js
export class UserMessage {
    constructor(content) {
      this.content = content;
      this.sender = 'User';
    }
}
  
export class AIMessage {
    constructor(content) {
      this.content = content;
      this.sender = 'AI';
    }
}

export class HouseKeeperMessage{
  constructor(content){
    this.content = content;
    this.sender = 'Housekeeper'
  }
}

export class HelperFormationMessage{
  constructor({potential_answers}){
    this.potential_answers = potential_answers;
    this.sender = 'Helper_Formation';
  }
}

export class HelperComprehensionMessage{
  constructor({vocabulary}){
    this.vocabulary = vocabulary
    this.sender = 'Helper_Comprehension';
  }
}

// export class HelperMessage {
//   constructor({vocabulary, potential_answers}) {
//     this.potential_answers = potential_answers;
//     this.vocabulary = vocabulary
//     this.sender = 'Helper';
//   }
// }