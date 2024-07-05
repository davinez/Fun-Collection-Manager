export interface OnAttributeCollectionSubmitEvent {
  type: string;
  source: string;
  data: SubmitData;
}

interface SubmitData {
  '@odata.type': string;
  tenantId: string;
  authenticationEventListenerId: string;
  customAuthenticationExtensionId: string;
  authenticationContext: AuthenticationContext;
  userSignUpInfo: UserSignUpInfo;
}

interface AuthenticationContext {
  correlationId: string;
  client: Client;
  protocol: string;
  clientServicePrincipal: ClientServicePrincipal;
  resourceServicePrincipal: ResourceServicePrincipal;
}

interface UserSignUpInfo {
  attributes: Attributes;
  identities: Identity[];
}

interface Identity {
  signInType: string;
  issuer: string;
  issuerAssignedId: string;
}

interface Client {
  ip: string;
  locale: string;
  market: string;
}

interface ClientServicePrincipal {
  id: string;
  appId: string;
  appDisplayName: string;
  displayName: string;
}

interface ResourceServicePrincipal {
  id: string;
  appId: string;
  appDisplayName: string;
  displayName: string;
}

interface Attributes {
  [key: string]: AttributeObject;
  city: City;
  country: Country;
  displayName: DisplayName;
  givenName: GivenName;
  email: Email;
  surname: Surname;
}

interface AttributeObject {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface City {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface Country {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface DisplayName {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface GivenName {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface Email {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

interface Surname {
  '@odata.type': string;
  value: string;
  attributeType: string;
}

export interface OnAttributeCollectionSubmitEventResponse {
  data: Data;
}

interface Data {
  '@odata.type': string;
  actions: Action[];
}

interface Action {
  '@odata.type': string;
  message?: string; // Optional property
}

