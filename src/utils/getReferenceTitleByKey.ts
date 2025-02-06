const keyToTitleMapping: { [key: string]: string } = {
  "delivery.challenge.answer": "form.delivery.challenge.answer",
  "delivery.challenge.question": "form.delivery.challenge.question",
  "delivery.date": "form.delivery.date",
  "delivery.language": "form.delivery.language",
  "delivery.message": "form.delivery.message",
  "recipient.address.city": "form.recipient.address.city",
  "recipient.address.country": "form.recipient.address.country",
  "recipient.address.postal": "form.recipient.address.postal",
  "recipient.address.state": "form.recipient.address.state",
  "recipient.address.street": "form.recipient.address.street",
  "recipient.carrier": "form.recipient.carrier",
  "recipient.country": "form.recipient.country",
  "recipient.email": "form.recipient.email",
  "recipient.firstName": "form.recipient.firstName",
  "recipient.lastName": "form.recipient.lastName",
  "recipient.middleName": "form.recipient.middleName",
  "recipient.msisdn": "form.recipient.msisdn",
  "sender.address.city": "form.sender.address.city",
  "sender.address.country": "form.sender.address.country",
  "sender.address.postal": "form.sender.address.postal",
  "sender.address.state": "form.sender.address.state",
  "sender.address.street": "form.sender.address.street",
  "sender.carrier": "form.sender.carrier",
  "sender.country": "form.sender.country",
  "sender.email": "form.sender.email",
  "sender.firstName": "form.sender.firstName",
  "sender.lastName": "form.sender.lastName",
  "sender.middleName": "form.sender.middleName",
  "sender.msisdn": "form.sender.msisdn"
};

export const getReferenceTitleByKey = (key: string): string => {
  return keyToTitleMapping[key] || `${key}`;
};
