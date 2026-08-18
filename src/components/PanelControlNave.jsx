// ============================================
// COMPONENTE PRINCIPAL: PanelControlNave
// ============================================
import { useState, useEffect, useMemo } from 'react';
import './PanelControlNave.css'; // Estilos del panel de control

// Componente hijo: EstadoNave (ejemplo de desmontaje)
const EstadoNave = ({ estado }) => {
  // useEffect para simular ciclo de vida del componente hijo
  useEffect(() => {
    console.log('🛸 EstadoNave: COMPONENTE MONTADO');
    
    // Cleanup function - se ejecuta en DESMONTAJE
    return () => {
      console.log('🛸 EstadoNave: COMPONENTE DESMONTADO');
    };
  }, []); // Array vacío = solo montaje y desmontaje

  // useEffect para detectar actualizaciones en 'estado'
  useEffect(() => {
    console.log(`🛸 EstadoNave: ACTUALIZACIÓN - Nuevo estado: ${estado}`);
  }, [estado]); // Se ejecuta cuando cambia 'estado'

  return (
    <div className="estado-nave">
      <h3>🚀 Estado Actual de la Nave</h3>
      <p>{estado}</p>
    </div>
  );
};

// Componente hijo: PlanetasVisitados
const PlanetasVisitados = ({ planetas }) => {
  // useEffect para simular ciclo de vida
  useEffect(() => {
    console.log('🌍 PlanetasVisitados: COMPONENTE MONTADO');
    
    return () => {
      console.log('🌍 PlanetasVisitados: COMPONENTE DESMONTADO');
    };
  }, []);

  // useEffect para actualizaciones
  useEffect(() => {
    console.log(`🌍 PlanetasVisitados: Lista actualizada - ${planetas.length} planetas`);
  }, [planetas]);

  return (
    <div className="planetas-visitados">
      <h3>🪐 Planetas Visitados</h3>
      <ul>
        {planetas.map((planeta, index) => (
          <li key={index}>{planeta}</li>
        ))}
      </ul>
    </div>
  );
};

// COMPONENTE PRINCIPAL
const PanelControlNave = () => {
  // ===== ESTADOS =====
  const [distancia, setDistancia] = useState(0); // Distancia recorrida (km)
  const [combustible, setCombustible] = useState(100); // Combustible disponible (%)
  const [estadoNave, setEstadoNave] = useState('En órbita'); // Estado de la nave
  const [planetas, setPlanetas] = useState(['Tierra']); // Planetas visitados
  const [mostrarPlanetas, setMostrarPlanetas] = useState(true); // Mostrar/ocultar planetas

  // ===== useEffect: SIMULACIÓN DE MONTAJE =====
  useEffect(() => {
    console.log('🚀 PanelControlNave: COMPONENTE MONTADO');
    console.log('📡 Iniciando sistemas de la nave...');
    
    // Simular carga inicial de datos
    setDistancia(150);
    setCombustible(85);
    
    // Cleanup function - se ejecuta en DESMONTAJE
    return () => {
      console.log('🚀 PanelControlNave: COMPONENTE DESMONTADO');
      console.log('💤 Apagando sistemas de la nave...');
    };
  }, []); // Array vacío = solo en montaje

  // ===== useEffect: VUELO SIMULADO (ACTUALIZACIONES) =====
  useEffect(() => {
    if (distancia === 0) return; // No ejecutar en estado inicial
    
    console.log(`📊 Actualización de vuelo: Distancia = ${distancia} km, Combustible = ${combustible}%`);
    
    // Simular consumo de combustible durante el viaje
    if (combustible > 0 && distancia > 0) {
      const nuevoCombustible = Math.max(0, combustible - 0.5);
      setCombustible(nuevoCombustible);
    }
    
    // Verificar si el combustible es crítico
    if (combustible < 20 && combustible > 0) {
      setEstadoNave('⚠️ Combustible bajo');
    } else if (combustible === 0) {
      setEstadoNave('🛑 Sin combustible - Modo emergencia');
    } else {
      setEstadoNave('✅ Viaje normal');
    }
  }, [distancia]); // Se ejecuta cuando cambia 'distancia'

  // ===== useEffect: DETECTAR LLEGADA A NUEVO PLANETA =====
  useEffect(() => {
    if (distancia === 0) return;
    
    // Cada 500 km se descubre un nuevo planeta
    const nuevoPlanetaIndex = Math.floor(distancia / 500);
    const planetasDescubiertos = [
      'Marte', 'Júpiter', 'Saturno', 'Urano', 'Neptuno', 'Plutón'
    ];
    
    if (nuevoPlanetaIndex > 0 && nuevoPlanetaIndex <= planetasDescubiertos.length) {
      const planeta = planetasDescubiertos[nuevoPlanetaIndex - 1];
      
      // Verificar si ya está en la lista
      if (!planetas.includes(planeta)) {
        console.log(`🌟 ¡Descubierto nuevo planeta: ${planeta}!`);
        setPlanetas(prev => [...prev, planeta]);
        setEstadoNave(`🪐 Visitando ${planeta}`);
      }
    }
  }, [distancia, planetas]);

  // ===== useMemo: OPTIMIZACIÓN DE CÁLCULOS COSTOSOS =====
  const estadisticasViaje = useMemo(() => {
    console.log('🔄 Calculando estadísticas del viaje...');
    
    // Simular cálculo complejo
    const calcular = () => {
      // Tiempo de viaje estimado (1 hora por cada 100 km)
      const tiempoEstimado = Math.round(distancia / 100);
      
      // Consumo promedio de combustible
      const consumoPromedio = distancia > 0 
        ? ((100 - combustible) / distancia * 100).toFixed(2)
        : 0;
      
      // Eficiencia de combustible (km por %)
      const eficiencia = combustible > 0 
        ? (distancia / (100 - combustible)).toFixed(2)
        : 0;
      
      return {
        tiempoEstimado,
        consumoPromedio,
        eficiencia,
        planetasVisitados: planetas.length
      };
    };
    
    return calcular();
  }, [distancia, combustible, planetas]); // Dependencias: se recalcula cuando cambian

  // ===== FUNCIONES DE CONTROL =====
  const viajar = () => {
    if (combustible <= 0) {
      alert('🚫 ¡Sin combustible! No puedes viajar.');
      return;
    }
    
    // Aumentar distancia (viaje)
    const incremento = Math.floor(Math.random() * 100) + 50;
    setDistancia(prev => prev + incremento);
  };

  const repostar = () => {
    setCombustible(prev => Math.min(100, prev + 20));
    setEstadoNave('⛽ Repostando combustible...');
    
    // Resetear estado después de 2 segundos
    setTimeout(() => {
      setEstadoNave('✅ Viaje normal');
    }, 2000);
  };

  const resetearViaje = () => {
    // Demostrar desmontaje al resetear
    setMostrarPlanetas(false);
    
    setTimeout(() => {
      setDistancia(0);
      setCombustible(100);
      setPlanetas(['Tierra']);
      setEstadoNave('🔄 Reiniciando viaje...');
      setMostrarPlanetas(true);
      
      setTimeout(() => {
        setEstadoNave('✅ Listo para despegar');
      }, 1000);
    }, 500);
  };

  // ===== RENDERIZADO =====
  return (
    <div className="panel-control">
      <h1>🚀 Panel de Control - Nave Espacial</h1>
      
      {/* Indicadores */}
      <div className="indicadores">
        <div className="indicador">
          <h3>📏 Distancia</h3>
          <p>{distancia} km</p>
        </div>
        <div className="indicador">
          <h3>⛽ Combustible</h3>
          <p>{combustible}%</p>
          <div className="barra-combustible">
            <div 
              className="nivel-combustible"
              style={{ 
                width: `${combustible}%`,
                backgroundColor: combustible > 30 ? '#4CAF50' : '#f44336'
              }}
            />
          </div>
        </div>
        <div className="indicador">
          <h3>🛸 Estado</h3>
          <p>{estadoNave}</p>
        </div>
      </div>

      {/* Componentes hijos (ciclo de vida) */}
      <EstadoNave estado={estadoNave} />
      
      {mostrarPlanetas && (
        <PlanetasVisitados planetas={planetas} />
      )}

      {/* Estadísticas del viaje (useMemo) */}
      <div className="estadisticas">
        <h3>📊 Estadísticas del Viaje</h3>
        <ul>
          <li>⏱️ Tiempo estimado: {estadisticasViaje.tiempoEstimado} horas</li>
          <li>⛽ Consumo promedio: {estadisticasViaje.consumoPromedio} %/km</li>
          <li>📈 Eficiencia: {estadisticasViaje.eficiencia} km/%</li>
          <li>🪐 Planetas visitados: {estadisticasViaje.planetasVisitados}</li>
        </ul>
      </div>

      {/* Botones de control */}
      <div className="controles">
        <button onClick={viajar} disabled={combustible <= 0}>
          🚀 Viajar
        </button>
        <button onClick={repostar}>
          ⛽ Repostar
        </button>
        <button onClick={resetearViaje}>
          🔄 Reiniciar viaje
        </button>
      </div>

      {/* Ciclo de vida - Estado para mostrar/ocultar componente */}
      <div className="debug-info">
        <h4>🔧 Información de Depuración</h4>
        <button onClick={() => setMostrarPlanetas(!mostrarPlanetas)}>
          {mostrarPlanetas ? 'Ocultar Planetas' : 'Mostrar Planetas'}
        </button>
        <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
          Observa la consola para ver el ciclo de vida de los componentes
        </p>
      </div>
    </div>
  );
};

export default PanelControlNave;