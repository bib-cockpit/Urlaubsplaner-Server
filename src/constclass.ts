export class Constclass {

  public readonly NONE: string;
  public readonly StandortecollectionName: string;
  public readonly MitarbeitercollectionName: string;
  public readonly ProjektecollectionName: string;
  public readonly SettingscollectionName: string;
  public readonly ProjektpunktecollectionName: string;
  public readonly ProtokollcollectionName: string;
  public readonly ChangelogcollectionName: string;
  public readonly BautagebuchecollectionName: string;
  public readonly LOPListecollectionName: string;
  public readonly EmailcollectionName: string;
  public readonly NotizenkapitelcollectionName: string;
  public readonly SimontabellencollectionName: string;
  public readonly BAESiteID: string;
  public readonly FestlegungskategoriecollectionName: string;

  constructor() {

    this.NONE                         = 'none';
    this.StandortecollectionName      = 'standorte';
    this.MitarbeitercollectionName    = 'mitarbeiter';
    this.SettingscollectionName       = 'mitarbeitersettings';
    this.ProjektecollectionName       = 'projekte';
    this.ProjektpunktecollectionName  = 'projektpunkte';
    this.ProtokollcollectionName      = 'protokolle';
    this.ChangelogcollectionName      = 'changelog';
    this.BautagebuchecollectionName   = 'bautagebuch';
    this.LOPListecollectionName       = 'lopliste';
    this.EmailcollectionName          = 'email';
    this.NotizenkapitelcollectionName = 'notizenkapitel';
    this.SimontabellencollectionName  = 'simontabellen';
    this.FestlegungskategoriecollectionName = 'festlegungskategorie';
    this.BAESiteID                    = 'baeeu.sharepoint.com,1b93d6ea-3f8b-4416-9ff1-a50aaba6f8ca,134790cc-e062-4882-ae5e-18813809cc87'; // Projekte Seite
  }
};
