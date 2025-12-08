import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { TrendingUp, Users, MapPin, BarChart3 } from 'lucide-react';

// Fix for default markers in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface BarangayAnalytics {
  barangay: string;
  responses: number;
  demographics: {
    ageGroups: Record<string, number>;
    gender: Record<string, number>;
    avgSatisfaction: number;
  };
  responseRate: number;
  coordinates?: [number, number];
  trends: {
    dailyResponses: number[];
    growth: number;
  };
}

interface ResponseMapProps {
  barangayData: BarangayAnalytics[];
  onBarangaySelect?: (barangay: BarangayAnalytics) => void;
  selectedMetric: 'responses' | 'satisfaction' | 'responseRate';
  timeRange: string;
}

// Valenzuela City barangay coordinates (approximate)
const barangayCoordinates: Record<string, [number, number]> = {
  'Arkong Bato': [14.7086, 120.9722],
  'Bagbaguin': [14.7201, 120.9753],
  'Balangkas': [14.6895, 120.9654],
  'Bignay': [14.6925, 120.9583],
  'Bisig': [14.7156, 120.9812],
  'Canumay East': [14.6789, 120.9725],
  'Canumay West': [14.6856, 120.9712],
  'Coloong': [14.7234, 120.9634],
  'Dalandanan': [14.6945, 120.9634],
  'Gen. T. de Leon': [14.7067, 120.9856],
  'Hen. T. de Leon': [14.7123, 120.9745],
  'Isla': [14.6823, 120.9867],
  'Karuhatan': [14.6934, 120.9756],
  'Lawang Bato': [14.7089, 120.9634],
  'Lingunan': [14.7145, 120.9567],
  'Mabolo': [14.6867, 120.9823],
  'Malanday': [14.6945, 120.9512],
  'Malinta': [14.7012, 120.9734],
  'Mapulang Lupa': [14.7234, 120.9512],
  'Marulas': [14.7089, 120.9812],
  'Maysan': [14.6978, 120.9645],
  'Palasan': [14.7156, 120.9623],
  'Parada': [14.6834, 120.9734],
  'Pariancillo Villa': [14.6923, 120.9612],
  'Paso de Blas': [14.7023, 120.9567],
  'Pasolo': [14.6889, 120.9689],
  'Poblacion': [14.7001, 120.9723],
  'Pulo': [14.6912, 120.9845],
  'Punturin': [14.7134, 120.9734],
  'Rincon': [14.6845, 120.9656],
  'Tagalag': [14.7078, 120.9589],
  'Ugong': [14.6934, 120.9678],
  'Viente Reales': [14.7189, 120.9712],
  'Wawang Pulo': [14.6867, 120.9734]
};

export function ResponseMap({ barangayData, onBarangaySelect, selectedMetric, timeRange }: ResponseMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayAnalytics | null>(null);

  // Get metric value for color coding
  const getMetricValue = (barangay: BarangayAnalytics) => {
    switch (selectedMetric) {
      case 'responses':
        return barangay.responses;
      case 'satisfaction':
        return barangay.demographics.avgSatisfaction;
      case 'responseRate':
        return barangay.responseRate;
      default:
        return barangay.responses;
    }
  };

  // Get color based on metric value
  const getMarkerColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity > 0.8) return '#dc2626'; // Dark red
    if (intensity > 0.6) return '#ea580c'; // Orange red
    if (intensity > 0.4) return '#f59e0b'; // Orange
    if (intensity > 0.2) return '#eab308'; // Yellow
    if (intensity > 0.1) return '#22c55e'; // Green
    return '#6b7280'; // Gray
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map with better styling
    const map = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false
    }).setView([14.6991, 120.9722], 13);

    // Add custom zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Add styled tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      className: 'map-tiles'
    }).addTo(map);

    // Store map instance
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !barangayData.length) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer: L.Layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) {
        map.removeLayer(layer);
      }
    });

    // Find max value for the selected metric
    const maxValue = Math.max(...barangayData.map(b => getMetricValue(b)));

    // Add interactive markers for each barangay
    barangayData.forEach(barangay => {
      const coordinates = barangayCoordinates[barangay.barangay];
      if (!coordinates) return;

      const metricValue = getMetricValue(barangay);
      const intensity = metricValue / maxValue;
      const radius = Math.max(8, 8 + (intensity * 25)); // Minimum size with scaling
      const color = getMarkerColor(metricValue, maxValue);

      // Create enhanced circle marker
      const circle = L.circle(coordinates, {
        color: color,
        fillColor: color,
        fillOpacity: 0.7,
        weight: 3,
        radius: radius * 40
      }).addTo(map);

      // Enhanced popup with detailed analytics
      const popupContent = `
        <div class="barangay-popup" style="font-family: Inter, sans-serif; min-width: 280px;">
          <div style="border-bottom: 2px solid ${color}; padding-bottom: 8px; margin-bottom: 12px;">
            <h3 style="margin: 0; color: #1f2937; font-size: 16px; font-weight: 700;">
              ${barangay.barangay}
            </h3>
            <div style="font-size: 11px; color: #6b7280; margin-top: 2px;">
              Barangay Analytics Dashboard
            </div>
          </div>
          
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 12px;">
            <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
              <div style="font-size: 20px; font-weight: bold; color: ${color};">${barangay.responses}</div>
              <div style="font-size: 11px; color: #6b7280;">Total Responses</div>
            </div>
            <div style="text-align: center; padding: 8px; background: #f8fafc; border-radius: 6px;">
              <div style="font-size: 20px; font-weight: bold; color: #059669;">${barangay.responseRate.toFixed(1)}%</div>
              <div style="font-size: 11px; color: #6b7280;">Response Rate</div>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">
              📊 Key Metrics
            </div>
            <div style="font-size: 11px; color: #6b7280; line-height: 1.4;">
              • Avg Satisfaction: <strong style="color: #1f2937;">${barangay.demographics.avgSatisfaction.toFixed(1)}/5.0</strong><br>
              • Growth Trend: <strong style="color: ${barangay.trends.growth >= 0 ? '#059669' : '#dc2626'};">
                ${barangay.trends.growth >= 0 ? '+' : ''}${barangay.trends.growth.toFixed(1)}%
              </strong><br>
              • Daily Avg: <strong style="color: #1f2937;">${(barangay.trends.dailyResponses.reduce((a,b) => a+b, 0) / 7).toFixed(1)} responses</strong>
            </div>
          </div>

          <div style="margin-bottom: 12px;">
            <div style="font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 6px;">
              👥 Demographics
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; font-size: 10px;">
              ${Object.entries(barangay.demographics.gender).map(([key, value]) => 
                `<div style="color: #6b7280;">${key}: <strong style="color: #1f2937;">${value}%</strong></div>`
              ).join('')}
            </div>
          </div>

          <button 
            onclick="window.selectBarangay && window.selectBarangay('${barangay.barangay}')"
            style="
              width: 100%; 
              padding: 8px 12px; 
              background: ${color}; 
              color: white; 
              border: none; 
              border-radius: 6px; 
              font-size: 11px; 
              font-weight: 600; 
              cursor: pointer;
              transition: all 0.2s;
            "
            onmouseover="this.style.opacity='0.8'"
            onmouseout="this.style.opacity='1'"
          >
            📈 View Detailed Analytics
          </button>
        </div>
      `;

      circle.bindPopup(popupContent, { 
        maxWidth: 300,
        className: 'custom-popup'
      });

      // Add click interaction
      circle.on('click', () => {
        setSelectedBarangay(barangay);
        onBarangaySelect?.(barangay);
      });

      // Hover effects
      circle.on('mouseover', () => {
        circle.setStyle({
          weight: 5,
          fillOpacity: 0.9
        });
      });

      circle.on('mouseout', () => {
        circle.setStyle({
          weight: 3,
          fillOpacity: 0.7
        });
      });
    });

    // Set up global function for popup button
    (window as any).selectBarangay = (barangayName: string) => {
      const barangay = barangayData.find(b => b.barangay === barangayName);
      if (barangay) {
        setSelectedBarangay(barangay);
        onBarangaySelect?.(barangay);
      }
    };

  }, [barangayData, selectedMetric, onBarangaySelect]);

  return (
    <div className="relative w-full h-[600px] bg-slate-50 rounded-lg overflow-hidden border shadow-sm">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Enhanced Legend */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border max-w-xs">
        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          {selectedMetric === 'responses' && 'Response Volume'}
          {selectedMetric === 'satisfaction' && 'Satisfaction Levels'}
          {selectedMetric === 'responseRate' && 'Response Rates'}
        </h4>
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-gray-700">Highest</span>
            </div>
            <span className="text-gray-500">80-100%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-700">High</span>
            </div>
            <span className="text-gray-500">60-80%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-gray-700">Medium</span>
            </div>
            <span className="text-gray-500">40-60%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-gray-700">Low</span>
            </div>
            <span className="text-gray-500">10-40%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-gray-700">Lowest</span>
            </div>
            <span className="text-gray-500">0-10%</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          <div className="font-medium">Current View:</div>
          <div className="text-gray-500">{timeRange} • {selectedMetric}</div>
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border">
        <div className="p-3">
          <div className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Valenzuela City
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>📍 Click markers for details</div>
            <div>🖱️ Hover for quick stats</div>
            <div>📊 {barangayData.length} barangays tracked</div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border">
        <div className="text-xs text-gray-600 space-y-2">
          <div className="font-semibold text-gray-800 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Quick Summary
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-gray-500">Total Responses</div>
              <div className="font-bold text-blue-600">
                {barangayData.reduce((sum, b) => sum + b.responses, 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Avg Satisfaction</div>
              <div className="font-bold text-green-600">
                {(barangayData.reduce((sum, b) => sum + b.demographics.avgSatisfaction, 0) / barangayData.length).toFixed(1)}/5.0
              </div>
            </div>
            <div>
              <div className="text-gray-500">Active Areas</div>
              <div className="font-bold text-purple-600">
                {barangayData.filter(b => b.responses > 0).length}/{barangayData.length}
              </div>
            </div>
            <div>
              <div className="text-gray-500">Growth Trend</div>
              <div className="font-bold text-orange-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {(barangayData.reduce((sum, b) => sum + b.trends.growth, 0) / barangayData.length).toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Barangay Details Panel */}
      {selectedBarangay && (
        <div className="absolute top-20 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-800">{selectedBarangay.barangay}</h4>
            <button 
              onClick={() => setSelectedBarangay(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-3 rounded">
                <div className="text-blue-600 font-bold text-lg">{selectedBarangay.responses}</div>
                <div className="text-blue-800 text-xs">Responses</div>
              </div>
              <div className="bg-green-50 p-3 rounded">
                <div className="text-green-600 font-bold text-lg">{selectedBarangay.demographics.avgSatisfaction.toFixed(1)}</div>
                <div className="text-green-800 text-xs">Satisfaction</div>
              </div>
            </div>
            <div className="text-xs text-gray-600">
              <div className="font-medium mb-1">7-Day Trend</div>
              <div className="flex gap-1">
                {selectedBarangay.trends.dailyResponses.map((count, i) => (
                  <div key={i} className="flex-1 bg-gray-200 rounded-sm overflow-hidden">
                    <div 
                      className="bg-blue-500 w-full transition-all"
                      style={{ 
                        height: `${Math.max(4, (count / Math.max(...selectedBarangay.trends.dailyResponses)) * 20)}px` 
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}