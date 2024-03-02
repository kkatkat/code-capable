## Checklist to follow when adding new modules

1. Import FactoryModule into the module's imports
2. Export any service or provider in the module's exports
3. Add the module into FactoryModule's imports
4. Add the exported services or providers into FactoryService.service.ts
5. Import FactoryService into the new service where you want to use it