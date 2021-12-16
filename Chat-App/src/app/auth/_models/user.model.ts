import { AuthModel } from './auth.model';
import { AddressModel } from './address.model';
import { SocialNetworksModel } from './social-networks.model';

export class UserModel extends AuthModel {


  id_user: number;
  IDNV: number;
  email: string;
  username: string;
  TinhTrang: Boolean;
   pass: string;
  // roles: number[];
  // occupation: string;
  // companyName: string;
  // phone: string;
  // address?: AddressModel;
  // socialNetworks?: SocialNetworksModel;
  // // personal information
  // firstname: string;
   lastname: string;
   pic:string;
  // website: string;
  // // account information
  // language: string;
  // timeZone: string;
  // communication: {
  //   email: boolean,
  //   sms: boolean,
  //   phone: boolean
  // };
  // // email settings
  // emailSettings: {
  //   emailNotification: boolean,
  //   sendCopyToPersonalEmail: boolean,
  //   activityRelatesEmail: {
  //     youHaveNewNotifications: boolean,
  //     youAreSentADirectMessage: boolean,
  //     someoneAddsYouAsAsAConnection: boolean,
  //     uponNewOrder: boolean,
  //     newMembershipApproval: boolean,
  //     memberRegistration: boolean
  //   },
  //   updatesFromKeenthemes: {
  //     newsAboutKeenthemesProductsAndFeatureUpdates: boolean,
  //     tipsOnGettingMoreOutOfKeen: boolean,
  //     thingsYouMissedSindeYouLastLoggedIntoKeen: boolean,
  //     newsAboutMetronicOnPartnerProductsAndOtherServices: boolean,
  //     tipsOnMetronicBusinessProducts: boolean
  //   }
  // };

  // setUser(user: any) {
  //   this.id = user.id;
  //   this.username = user.username || '';
  //   this.password = user.password || '';
  //   this.fullname = user.fullname || '';
  //   this.email = user.email || '';
  //   this.pic = user.pic || './assets/media/users/default.jpg';
  //   this.roles = user.roles || [];
  //   this.occupation = user.occupation || '';
  //   this.companyName = user.companyName || '';
  //   this.phone = user.phone || '';
  //   this.address = user.address;
  //   this.socialNetworks = user.socialNetworks;
  // }
}
