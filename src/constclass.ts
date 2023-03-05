export class Constclass {

  public readonly NONE: string;
  public readonly StandortecollectionName: string;
  public readonly MitarbeitercollectionName: string;
  public readonly ProjektecollectionName: string;
  public readonly SettingscollectionName: string;
  public readonly ProjektpunktecollectionName: string;
  public readonly ProtokollcollectionName: string;
  public readonly ChangelogcollectionName: string;

  constructor() {

    this.NONE                        = 'none';
    this.StandortecollectionName     = 'standorte';
    this.MitarbeitercollectionName   = 'mitarbeiter';
    this.SettingscollectionName      = 'mitarbeitersettings';
    this.ProjektecollectionName      = 'projekte';
    this.ProjektpunktecollectionName = 'projektpunkte';
    this.ProtokollcollectionName     = 'protokolle';
    this.ChangelogcollectionName     = 'changelog';
  }
};
