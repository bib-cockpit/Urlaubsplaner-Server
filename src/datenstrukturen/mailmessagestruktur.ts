export type Mailmessagestruktur = {
  message: {
    subject: string,
    body: {
      contentType: string,
      content: string
    },
    toRecipients:
      {
        emailAddress: {

          address: string;
        }
      }[]
    ,
    ccRecipients?:
      {
        emailAddress: {
          address: string;
        }
      }[]
    ,
    attachments?: [
      {
        "@odata.type": string,
        contentBytes:  string,
        name:          string,
        contentType:   string
      }
    ]
  },
  saveToSentItems: boolean
}
