#Notas al desarrollo de mi web

##Entrega
Hice una entrega a falta de desarrollar algo más ajax. Mi idea es cambiar la sección trastos por una más seria en la que poner mis proyectos personales, algunos con enlaces a github,... ya veremos.

Si esta última entrega no sirve (por estar fuera de hora, hay un commit justo antes de las 00:00 del día 16 que sería mi práctica).

Muchas gracias.

##Responsive
Para la adaptación a distintos terminales he decidido estos media queries

~~~
movil				→ 'mv': @media (max-width: 767px) 
tablet 				→ 'tb': @media (max-width: 1023px) 
small-desktop 		→ 'sd': @media (max-width: 1199px) 
large-desktop 		→ 'ld': @media (min-width: 1200px) 
~~~

##Imagen flip incompatible con IE11 por backface-visibility
A falta de arreglarlo quito el efecto

