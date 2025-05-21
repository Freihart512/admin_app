# US03

## Ver propiedades y contratos (Panel propietario)

**Caso de Uso:** [[📄 CasosDeUso/CU01_GESTIONAR_PROPIETARIOS]]

Como propietario, quiero acceder a un panel donde vea todas mis propiedades, sus estados y contratos activos.

**Detalles Backend:**
- El backend debe proporcionar al dashboard del propietario una lista de sus propiedades, incluyendo la dirección y el estado (`rentada` o `vacía`) de cada una.
- Para cada propiedad, se deben incluir los contratos **activos**, mostrando detalles clave como el nombre del inquilino asociado y la fecha del próximo pago (`due_date`) del contrato.
