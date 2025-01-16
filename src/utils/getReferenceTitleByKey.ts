const keyToTitleMapping: { [key: string]: string } = {
    "delivery.challenge.answer": "challenge answer",
    "delivery.challenge.question": "challenge question",
    "delivery.date": "date",
    "delivery.language": "language code",
    "delivery.message": "gift message",
    "recipient.address.city": "recipient city",
    "recipient.address.country": "recipient country",
    "recipient.address.postal": "recipient postal code",
    "recipient.address.state": "recipient state/province",
    "recipient.address.street": "recipient street address",
    "recipient.carrier": "recipient carrier",
    "recipient.country": "recipient country",
    "recipient.email": "recipient email",
    "recipient.firstName": "recipient first name",
    "recipient.lastName": "recipient last name",
    "recipient.middleName": "recipient middle name",
    "recipient.msisdn": "recipient phone number",
    "sender.address.city": "sender city",
    "sender.address.country": "sender country",
    "sender.address.postal": "sender postal code",
    "sender.address.state": "sender state/province",
    "sender.address.street": "sender street address",
    "sender.carrier": "sender carrier",
    "sender.country": "sender country",
    "sender.email": "sender email",
    "sender.firstName": "sender first name",
    "sender.lastName": "sender last name",
    "sender.middleName": "sender middle name",
    "sender.msisdn": "sender phone number",
  };
  
  export const getReferenceTitleByKey = (key: string): string => {
    return keyToTitleMapping[key] || key;
  }
  