// Interfaz base para todos los eventos de dominio o aplicación
export interface IDomainEvent {
  id?: string;
  type: string;
  timestamp: Date;
  payload: any; // Mantendremos any aquí en la interfaz base
}
