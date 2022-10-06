import { ToDate, Trim } from 'class-sanitizer';
import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  IsFQDN,
  IsOptional,
  IsDate,
  IsEnum,
  IsObject,
  IsLowercase,
  IsDateString,
  IsNumber,
  ValidateIf,
} from 'class-validator';
import { toLower } from 'lodash';

enum Eventtype {
  identify,
  page,
  screen,
  track,
  group,
  alias,
}

export class SegmentEventDto {
  //https://segment.com/docs/connections/spec/

  // ** common spec ** specifics  below

  // anonymousId
  // userId
  // sentAt
  // context
  // messageId
  // type
  // version
  // timestamp
  // integrations
  // receivedAt

  @ValidateIf((o) => !o.anonymousId)
  @Trim()
  @IsNotEmpty()
  public userId: string;

  @ValidateIf((o) => !o.userId)
  @Trim()
  @IsNotEmpty()
  public anonymousId: string;

  //checked
  @ToDate()
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  public sentAt: Date;

  @IsObject()
  @IsOptional()
  //object
  public context: any;

  @IsString()
  @IsOptional()
  public messageId: string;

  //cheked
  @IsEnum(Eventtype)
  @IsNotEmpty()
  public type: Eventtype;

  //checked
  @IsNumber()
  @IsNotEmpty()
  public version: number;

  @ToDate()
  @IsDateString()
  @IsNotEmpty()
  public timestamp: Date;

  @IsObject()
  @IsOptional()
  //object
  public integrations: any;

  @ToDate()
  @IsDateString()
  @IsNotEmpty()
  public receivedAt: Date;

  @ToDate()
  @IsDateString()
  @IsNotEmpty()
  @IsOptional()
  public originalTimestamp: Date;

  //page, screen
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public category: string;

  //track
  //not there or required
  @IsString()
  @IsOptional()
  public event: string;

  //object
  @IsObject()
  @IsOptional()
  public properties: any;

  //group
  @IsString()
  @IsOptional()
  public groupId: string;

  //object
  @IsObject()
  @IsOptional()
  public traits: any;

  @IsString()
  @IsOptional()
  public projectId: string;

  @IsString()
  @IsOptional()
  public channel: string;
}

//example event:

// {
//     "anonymousId": "507f191e810c19729de860ea",
//     "context": {
//       "active": true,
//       "app": {
//         "name": "InitechGlobal",
//         "version": "545",
//         "build": "3.0.1.545",
//         "namespace": "com.production.segment"
//       },
//       "campaign": {
//         "name": "TPS Innovation Newsletter",
//         "source": "Newsletter",
//         "medium": "email",
//         "term": "tps reports",
//         "content": "image link"
//       },
//       "device": {
//         "id": "B5372DB0-C21E-11E4-8DFC-AA07A5B093DB",
//         "advertisingId": "7A3CBEA0-BDF5-11E4-8DFC-AA07A5B093DB",
//         "adTrackingEnabled": true,
//         "manufacturer": "Apple",
//         "model": "iPhone7,2",
//         "name": "maguro",
//         "type": "ios",
//         "token": "ff15bc0c20c4aa6cd50854ff165fd265c838e5405bfeb9571066395b8c9da449"
//       },
//       "ip": "8.8.8.8",
//       "library": {
//         "name": "analytics.js",
//         "version": "2.11.1"
//       },
//       "locale": "en-US",
//       "location": {
//         "city": "San Francisco",
//         "country": "United States",
//         "latitude": 40.2964197,
//         "longitude": -76.9411617,
//         "speed": 0
//       },
//       "network": {
//         "bluetooth": false,
//         "carrier": "T-Mobile US",
//         "cellular": true,
//         "wifi": false
//       },
//       "os": {
//         "name": "iPhone OS",
//         "version": "8.1.3"
//       },
//       "page": {
//         "path": "/academy/",
//         "referrer": "",
//         "search": "",
//         "title": "Analytics Academy",
//         "url": "https://segment.com/academy/"
//       },
//       "referrer": {
//         "id": "ABCD582CDEFFFF01919",
//         "type": "dataxu"
//       },
//       "screen": {
//         "width": 320,
//         "height": 568,
//         "density": 2
//       },
//       "groupId": "12345",
//       "timezone": "Europe/Amsterdam",
//       "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
//     },
//     "integrations": {
//       "All": true,
//       "Mixpanel": false,
//       "Salesforce": false
//     },
//     "messageId": "022bb90c-bbac-11e4-8dfc-aa07a5b093db",
//     "receivedAt": "2015-12-10T04:08:31.909Z",
//     "sentAt": "2015-12-10T04:08:31.581Z",
//     "timestamp": "2015-12-10T04:08:31.905Z",
//     "type": "track",
//     "userId": "97980cfea0067",
//     "version": 2
//   }
