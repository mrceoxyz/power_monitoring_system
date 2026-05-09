/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Zap, Activity, TrendingUp, TrendingDown, Power, AlertCircle, Wifi, WifiOff, Battery, BatteryCharging, Bell, DollarSign, Server, CheckCircle, XCircle, FileText, Download, Send, Users, PlugZap, Radical } from 'lucide-react';

export default function PowerMonitoringApp() {
  const [currentData, setCurrentData] = useState({
    voltage: 0,
    current: 0,
    power: 0,
    frequency: 0,
    powerFactor: 0,
    batteryVoltage: 0,
    batterySoC: 0
  });
  
  const [historicalData, setHistoricalData] = useState([]);
  const [dailyConsumption, setDailyConsumption] = useState([]);
  const [batteryHistory, setBatteryHistory] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedDevice2, setSelectedDevice2] = useState(null);
  const [alerts, setAlerts] = useState([]);
  // const [tariffs, setTariffs] = useState([]);
  // const [selectedTariff, setSelectedTariff] = useState(null);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  // const [selectedReportDevice, setSelectedReportDevice] = useState('all');
  const [reports, setReports] = useState([]);
  // const [whatsappMessages, setWhatsappMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [apiUrl] = useState('http://127.0.0.1:8000/api');
  const [activeTab, setActiveTab] = useState('dashboard');

  // Fetch all devices
  const fetchDevices = async () => {
    try {
      const response = await fetch(`${apiUrl}/devices/active/`);
      if (!response.ok) throw new Error('Failed to fetch devices');
      const data = await response.json();
      setDevices(data);
      if (data.length > 0 && !selectedDevice) {
        setSelectedDevice(data[0].device_id);
      }
    } catch (err) {
      console.error('Error fetching devices:', err);
    }
  };

  // Fetch latest reading
  const fetchLatestReading = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/readings/latest/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch latest reading');
      
      const data = await response.json();
      setCurrentData({
        voltage: data.voltage,
        current: data.current,
        power: data.power,
        frequency: data.frequency,
        powerFactor: data.power_factor,
        batteryVoltage: data.battery_voltage || 0,
        batterySoC: data.battery_soc || 0
      });
      
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching latest reading:', err);
      setError(err.message);
      setIsConnected(false);
    }
  };

  // Fetch recent readings
  const fetchRecentReadings = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/readings/recent/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch recent readings');
      
      const data = await response.json();
      const formattedData = data.map(reading => ({
        ...reading,
        timestamp: new Date(reading.timestamp).toLocaleTimeString(),
        powerFactor: reading.power_factor
      }));
      setHistoricalData(formattedData.slice(-20));
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching recent readings:', err);
      setError(err.message);
      setIsConnected(false);
    }
  };

  // Fetch weekly consumption
  const fetchWeeklyConsumption = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/consumption/weekly/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch weekly consumption');
      
      const data = await response.json();
      const formattedData = data.map(item => ({
        day: new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }),
        consumption: item.total_consumption,
        cost: item.total_cost,
        date: item.date
      })).reverse();
      
      setDailyConsumption(formattedData);
      setIsConnected(true);
      setError(null);
    } catch (err) {
      console.error('Error fetching weekly consumption:', err);
      setError(err.message);
      setIsConnected(false);
    }
  };

  // Fetch alerts
  const fetchAlerts = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/alerts/active/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch alerts');
      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    }
  };

  // Fetch battery history
  const fetchBatteryHistory = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/battery/history/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch battery history');
      
      const data = await response.json();
      const formattedData = data.map(reading => ({
        timestamp: new Date(reading.timestamp).toLocaleTimeString(),
        soc: reading.soc,
        voltage: reading.voltage
      }));
      
      setBatteryHistory(formattedData.slice(-20));
    } catch (err) {
      console.error('Error fetching battery history:', err);
    }
  };

  // Fetch clients
  const fetchClients = async () => {
    try {
      const deviceParam = selectedDevice ? `?device_id=${selectedDevice}` : '';
      const response = await fetch(`${apiUrl}/clients/by_device/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data);
      
      if (data.length > 0 && !selectedClient) {
        setSelectedClient(data[0].id);
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  };

  // Fetch reports
  const fetchReports = async () => {
    try {
      const deviceParam = selectedDevice2 ? `?device_id=${selectedDevice2}` : '';
      const response = await fetch(`${apiUrl}/reports/by_device/${deviceParam}`);
      if (!response.ok) throw new Error('Failed to fetch reports');
      const data = await response.json();
      setReports(data);
      console.log(data);
      
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  // Fetch WhatsApp messages
  // const fetchWhatsAppMessages = async () => {
  //   try {
  //     const response = await fetch(`${apiUrl}/whatsapp/recent/?limit=20`);
  //     if (!response.ok) throw new Error('Failed to fetch WhatsApp messages');
  //     const data = await response.json();
  //     setWhatsappMessages(data);
      
  //   } catch (err) {
  //     console.error('Error fetching WhatsApp messages:', err);
  //   }
  // };

  // Generate report
  const generateReport = async (reportType = 'WEEKLY', sendWhatsApp = false, sendEmail = false) => {
    if (!selectedClient) return;
    
    try {
      const payload = {
        client_id: selectedClient,
        report_type: reportType,
        send_whatsapp: sendWhatsApp,
        send_email: sendEmail
      };
      
      // Add device_id if specific device selected
      if (selectedDevice !== 'all') {
        payload.device_id = selectedDevice;
      }
      
      const response = await fetch(`${apiUrl}/reports/generate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed to generate report');
      
      const data = await response.json();
      console.log(data);
      
      const notifications = [];
      if (sendWhatsApp) notifications.push('WhatsApp');
      if (sendEmail) notifications.push('Email');
      
      alert(`Report generated successfully!${notifications.length > 0 ? ` Sent via ${notifications.join(' and ')}.` : ''}`);
      fetchReports();
    } catch (err) {
      console.error('Error generating report:', err);
      alert('Failed to generate report');
    }
  };

  // Download PDF
  const downloadReportPDF = async (reportId, reportName, reportType, reportStartDate, reportEndDate, reportDeviceName) => {
    try {
      const response = await fetch(`${apiUrl}/reports/${reportId}/download_pdf/`);
      
      if (!response.ok) throw new Error('Failed to download PDF');
      
      // Create blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName}_${reportType}_${reportStartDate}_${reportEndDate}_${reportDeviceName}_report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      alert('PDF downloaded successfully!');
    } catch (err) {
      console.error('Error downloading PDF:', err);
      alert('Failed to download PDF');
    }
  };
  // Send report via WhatsApp
  const sendReportWhatsApp = async (reportId) => {
    try {
      const response = await fetch(`${apiUrl}/reports/${reportId}/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          send_whatsapp: true,
          send_email: false
        })
      });
      
      if (!response.ok) throw new Error('Failed to send report');
      
      alert('Report sent via WhatsApp!');
      // fetchWhatsAppMessages();
    } catch (err) {
      console.error('Error sending report:', err);
      alert('Failed to send report');
    }
  };

  // Send report via Email
  const sendReportEmail = async (reportId) => {
    try {
      const response = await fetch(`${apiUrl}/reports/${reportId}/send/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          send_whatsapp: false,
          send_email: true
        })
      });
      
      if (!response.ok) throw new Error('Failed to send report');
      
      alert('Report sent via Email!');
      fetchReports();
    } catch (err) {
      console.error('Error sending report:', err);
      alert('Failed to send report');
    }
  };
  // const fetchTariffs = async () => {
  //   try {
  //     const response = await fetch(`${apiUrl}/tariffs/active/`);
  //     if (!response.ok) throw new Error('Failed to fetch tariffs');
      
  //     const data = await response.json();
  //     setTariffs(data);
  //     if (data.length > 0 && !selectedTariff) {
  //       setSelectedTariff(data[0]);
  //     }
  //   } catch (err) {
  //     console.error('Error fetching tariffs:', err);
  //   }
  // };

  // Acknowledge alert
  const acknowledgeAlert = async (alertId) => {
    try {
      await fetch(`${apiUrl}/alerts/${alertId}/acknowledge/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error acknowledging alert:', err);
    }
  };

  // Resolve alert
  const resolveAlert = async (alertId) => {
    try {
      await fetch(`${apiUrl}/alerts/${alertId}/resolve/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      fetchAlerts();
    } catch (err) {
      console.error('Error resolving alert:', err);
    }
  };

  // Initialize
  useEffect(() => {
    fetchDevices();
    // fetchTariffs();
    fetchClients();
    fetchReports();
    // fetchWhatsAppMessages();
  }, []);

  // Fetch data when device changes
  useEffect(() => {
    if (selectedDevice) {
      fetchLatestReading();
      fetchRecentReadings();
      fetchWeeklyConsumption();
      fetchBatteryHistory();
      fetchAlerts();
      fetchClients();
      // fetchReports();
    }
  }, [selectedDevice]);

  useEffect(() => {
    if (selectedDevice2) {
      fetchReports();
    }
  }, [selectedDevice2]);

  // Polling intervals
  useEffect(() => {
    const interval = setInterval(fetchLatestReading, 3000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  useEffect(() => {
    const interval = setInterval(fetchRecentReadings, 10000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  useEffect(() => {
    const interval = setInterval(fetchAlerts, 15000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  useEffect(() => {
    const interval = setInterval(fetchBatteryHistory, 10000);
    return () => clearInterval(interval);
  }, [selectedDevice]);

  const totalConsumption = dailyConsumption.reduce((sum, day) => sum + day.consumption, 0);
  const totalCost = dailyConsumption.reduce((sum, day) => sum + (day.cost || 0), 0);
  const avgConsumption = dailyConsumption.length > 0 
    ? (totalConsumption / dailyConsumption.length).toFixed(1) 
    : '0.0';

  // const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  // const warningAlerts = alerts.filter(a => a.severity === 'WARNING').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <PlugZap className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">Smart Power Monitoring</h1>
                <p className="text-blue-200">Multi-device monitoring with alerts & analytics</p>
              </div>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center gap-4">
              {/* Alerts */}
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg border border-white/20">
                {/* <Bell className={criticalAlerts > 0 ? "text-red-400 animate-pulse" : "text-white"} size={20} /> */}
                <span className="text-white font-medium">{alerts.length} Alerts</span>
              </div>
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isConnected 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="text-green-400" size={20} />
                    <span className="text-green-400 font-medium">Online</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="text-red-400" size={20} />
                    <span className="text-red-400 font-medium">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Device Selector & Navigation */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <Server size={20} className="text-white" />
              <select 
                value={selectedDevice || ''}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="bg-transparent text-white font-medium outline-none cursor-pointer"
              >
                {devices.map(device => (
                  <option key={device.device_id} value={device.device_id} className="bg-slate-800">
                    {device.device_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2">
              {['dashboard', 'battery', 'alerts', 'clients'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/50 rounded-lg p-4">
              <AlertCircle className="text-red-400" size={20} />
              <span className="text-red-400">Error: {error}</span>
              <button 
                onClick={() => {
                  fetchLatestReading();
                  fetchRecentReadings();
                  fetchWeeklyConsumption();
                }}
                className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition"
              >
                Retry
              </button>
            </div>
          )}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Real-time Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              <MetricCard
                title="Voltage"
                value={currentData.voltage.toFixed(1)}
                unit="V"
                icon={<Activity size={24} />}
                color="blue"
              />
              <MetricCard
                title="Current"
                value={currentData.current.toFixed(2)}
                unit="A"
                icon={<Zap size={24} />}
                color="green"
              />
              <MetricCard
                title="Power"
                value={currentData.power.toFixed(0)}
                unit="W"
                icon={<Power size={24} />}
                color="purple"
              />
              <MetricCard
                title="Frequency"
                value={currentData.frequency.toFixed(1)}
                unit="Hz"
                icon={<Activity size={24} />}
                color="yellow"
              />
              <MetricCard
                title="Power Factor"
                value={currentData.powerFactor.toFixed(2)}
                unit=""
                icon={<Radical size={24} />}
                color="pink"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Real-time Power Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Real-time Power Usage</h2>
                {historicalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="timestamp" stroke="#fff" tick={{ fill: '#fff' }} />
                      <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid #3b82f6',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="power" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                        name="Power (W)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-white/50">
                    No data available
                  </div>
                )}
              </div>

              {/* Weekly Consumption Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Weekly Consumption</h2>
                {dailyConsumption.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyConsumption}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                      <XAxis dataKey="day" stroke="#fff" tick={{ fill: '#fff' }} />
                      <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0,0,0,0.8)', 
                          border: '1px solid #10b981',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="consumption" fill="#10b981" name="Energy (kWh)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-white/50">
                    No data available
                  </div>
                )}
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Weekly Consumption</h3>
                <p className="text-3xl font-bold text-blue-400">{totalConsumption.toFixed(1)} kWh</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Daily Average</h3>
                <p className="text-3xl font-bold text-green-400">{avgConsumption} kWh</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Weekly Cost</h3>
                <p className="text-3xl font-bold text-purple-400">₦{totalCost.toFixed(0)}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Battery Status</h3>
                <p className="text-3xl font-bold text-yellow-400">{currentData.batterySoC.toFixed(0)}%</p>
              </div>
            </div>
          </>
        )}

        {/* Battery Tab */}
        {activeTab === 'battery' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Battery Voltage</span>
                  <Battery size={24} />
                </div>
                <p className="text-4xl font-bold">{currentData.batteryVoltage.toFixed(2)} V</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">State of Charge</span>
                  <BatteryCharging size={24} />
                </div>
                <p className="text-4xl font-bold">{currentData.batterySoC.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Status</span>
                  <Activity size={24} />
                </div>
                <p className="text-2xl font-bold">
                  {currentData.batteryVoltage > 13.5 ? 'Charging' : 'Discharging'}
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4">Battery History (24h)</h2>
              {batteryHistory.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={batteryHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                    <XAxis dataKey="timestamp" stroke="#fff" tick={{ fill: '#fff' }} />
                    <YAxis stroke="#fff" tick={{ fill: '#fff' }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(0,0,0,0.8)', 
                        border: '1px solid #eab308',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="soc" 
                      stroke="#eab308" 
                      fill="#eab308"
                      fillOpacity={0.6}
                      name="SoC (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-white/50">
                  No battery data available
                </div>
              )}
            </div>
          </>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && (
          <div className="space-y-4">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <div 
                  key={alert.id}
                  className={`bg-white/10 backdrop-blur-lg rounded-xl p-6 border ${
                    alert.severity === 'CRITICAL' 
                      ? 'border-red-500/50 bg-red-500/10'
                      : alert.severity === 'WARNING'
                      ? 'border-yellow-500/50 bg-yellow-500/10'
                      : 'border-blue-500/50 bg-blue-500/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          alert.severity === 'CRITICAL' 
                            ? 'bg-red-500 text-white'
                            : alert.severity === 'WARNING'
                            ? 'bg-yellow-500 text-black'
                            : 'bg-blue-500 text-white'
                        }`}>
                          {alert.severity}
                        </span>
                        <span className="text-white font-semibold">{alert.alert_type}</span>
                        <span className="text-white/60 text-sm">
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-white mb-2">{alert.message}</p>
                      {alert.value && (
                        <p className="text-white/80">Value: {alert.value.toFixed(2)}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Acknowledge
                      </button>
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Resolve
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 border border-white/20 text-center">
                <CheckCircle className="mx-auto mb-4 text-green-400" size={48} />
                <h3 className="text-2xl font-bold text-white mb-2">All Clear!</h3>
                <p className="text-white/60">No active alerts at this time.</p>
              </div>
            )}
          </div>
        )}

        {/* Billing Tab */}
        {/* {activeTab === 'billing' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Energy Tariffs</h2>
                <div className="space-y-3">
                  {tariffs.map(tariff => (
                    <div
                      key={tariff.id}
                      className={`p-4 rounded-lg cursor-pointer transition ${
                        selectedTariff?.id === tariff.id
                          ? 'bg-blue-500/30 border-2 border-blue-500'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      }`}
                      onClick={() => setSelectedTariff(tariff)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-white font-semibold">{tariff.name}</span>
                        <span className="text-white font-bold">
                          {tariff.rate_per_kwh} {tariff.currency}/kWh
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Cost Breakdown</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white">Weekly Consumption</span>
                    <span className="text-white font-bold">{totalConsumption.toFixed(2)} kWh</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white">Rate per kWh</span>
                    <span className="text-white font-bold">
                      {selectedTariff ? `${selectedTariff.rate_per_kwh} ${selectedTariff.currency}` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/50">
                    <span className="text-white font-semibold">Total Weekly Cost</span>
                    <span className="text-2xl text-white font-bold">
                      {selectedTariff 
                        ? `${selectedTariff.currency} ${(totalConsumption * selectedTariff.rate_per_kwh).toFixed(2)}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <span className="text-white">Estimated Monthly</span>
                    <span className="text-white font-bold">
                      {selectedTariff 
                        ? `${selectedTariff.currency} ${(totalConsumption * 4.3 * selectedTariff.rate_per_kwh).toFixed(2)}`
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )} */}

        {/* Reports Tab */}
        {/* {activeTab === 'reports' && (
          <>
            <div className="mb-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-white">Energy Reports</h2>
                <div className="flex gap-3">
                  <button
                    onClick={() => generateReport('DAILY', false)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <FileText size={20} />
                    Daily Report
                  </button>
                  <button
                    onClick={() => generateReport('WEEKLY', false)}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <FileText size={20} />
                    Weekly Report
                  </button>
                  <button
                    onClick={() => generateReport('MONTHLY', false)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <FileText size={20} />
                    Monthly Report
                  </button>
                  <button
                    onClick={() => generateReport('WEEKLY', true, false)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send via WhatsApp
                  </button>
                  <button
                    onClick={() => generateReport('WEEKLY', false, true)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send via Email
                  </button>
                  <button
                    onClick={() => generateReport('WEEKLY', true, true)}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg text-white font-medium transition flex items-center gap-2"
                  >
                    <Send size={20} />
                    Send Both
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20">
              <Server size={20} className="text-white" />
              <select 
                value={selectedDevice2 || ''}
                onChange={(e) => setSelectedDevice2(e.target.value)}
                className="bg-transparent text-white font-medium outline-none cursor-pointer"
              >
                {devices.map(device => (
                  <option key={device.id} value={device.id} className="bg-slate-800">
                    {device.device_name}
                  </option>
                ))}
              </select>
            </div>
              
              <div className="grid grid-cols-1 gap-4">
                {reports.length > 0 ? (
                  reports.map(report => (
                    <div key={report.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-500/30 text-blue-400 rounded-full text-sm font-bold">
                              {report.report_type}
                            </span>
                            <span className="text-white font-semibold">{report.client_name}</span>
                            {report.device_name && (
                              <span className="text-white/60 text-sm">• {report.device_name}</span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                            <div>
                              <p className="text-white/60 text-sm">Period</p>
                              <p className="text-white font-medium">{report.start_date} to {report.end_date}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Consumption</p>
                              <p className="text-white font-bold">{report.total_consumption_kwh.toFixed(2)} kWh</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Total Cost</p>
                              <p className="text-white font-bold">₦{report.total_cost.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-white/60 text-sm">Alerts</p>
                              <p className="text-white font-bold">
                                {report.total_alerts} ({report.critical_alerts} critical)
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-3">
                            {report.sent_via_whatsapp && (
                              <span className="text-green-400 text-sm flex items-center gap-1">
                                <CheckCircle size={16} />
                                Sent via WhatsApp
                              </span>
                            )}
                            {report.sent_via_email && (
                              <span className="text-green-400 text-sm flex items-center gap-1">
                                <CheckCircle size={16} />
                                Sent via Email
                              </span>
                            )}
                            <span className="text-white/60 text-sm">
                              Generated: {new Date(report.generated_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => sendReportWhatsApp(report.id)}
                            className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium transition flex items-center gap-2"
                            title="Send via WhatsApp"
                          >
                            <Send size={16} />
                            WhatsApp
                          </button>
                          <button
                            onClick={() => sendReportEmail(report.id)}
                            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium transition flex items-center gap-2"
                            title="Send via Email"
                          >
                            <Send size={16} />
                            Email
                          </button>
                          <button 
                            onClick={() => downloadReportPDF(report.id, report.client_name, report.report_type, report.start_date, report.end_date, report.device_name)}
                            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium transition flex items-center gap-2">
                            <Download size={16} />
                            PDF
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-white/60">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No reports generated yet. Click the buttons above to create your first report.</p>
                  </div>
                )}
              </div>
            </div> */}

            {/* WhatsApp Messages History */}
            {/* <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Send size={24} />
                Recent WhatsApp Messages
              </h2>
              <div className="space-y-2">
                {whatsappMessages.length > 0 ? (
                  whatsappMessages.map(msg => (
                    <div key={msg.id} className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-white font-medium">{msg.recipient}</span>
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              msg.status === 'SENT' ? 'bg-green-500/30 text-green-400' :
                              msg.status === 'FAILED' ? 'bg-red-500/30 text-red-400' :
                              'bg-yellow-500/30 text-yellow-400'
                            }`}>
                              {msg.status}
                            </span>
                            <span className="text-white/60 text-sm">{msg.message_type}</span>
                          </div>
                          <p className="text-white/80 text-sm">{msg.message.substring(0, 100)}...</p>
                        </div>
                        <span className="text-white/60 text-sm">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-white/60 py-6">No WhatsApp messages sent yet</p>
                )}
              </div>
            </div> */}
          {/* </>
        )} */}

        {/* Clients Tab */}
        {activeTab === 'clients' && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                <Users size={28} />
                Clients Management
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {clients.length > 0 ? (
                clients.map(client => (
                  <div key={client.id} className="bg-white/5 rounded-lg p-6 border border-white/10 hover:bg-white/10 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-bold text-white">{client.name}</h3>
                          {client.is_active ? (
                            <span className="px-3 py-1 bg-green-500/30 text-green-400 rounded-full text-sm font-bold">
                              Active
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-500/30 text-gray-400 rounded-full text-sm font-bold">
                              Inactive
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-white/60 text-sm">Contact</p>
                            <p className="text-white">{client.phone}</p>
                            {client.email && <p className="text-white/80 text-sm">{client.email}</p>}
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">WhatsApp</p>
                            <p className="text-white">{client.whatsapp_number}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Report Frequency</p>
                            <p className="text-white font-medium">{client.report_frequency}</p>
                          </div>
                          <div>
                            <p className="text-white/60 text-sm">Devices</p>
                            <p className="text-white font-bold">{client.devices.length} device(s)</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {client.receive_whatsapp_alerts && (
                            <span className="text-green-400 text-sm flex items-center gap-1">
                              <CheckCircle size={16} />
                              WhatsApp Alerts Enabled
                            </span>
                          )}
                          {client.receive_email_reports && (
                            <span className="text-blue-400 text-sm flex items-center gap-1">
                              <CheckCircle size={16} />
                              Email Reports Enabled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-white/60">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No clients found. Add clients in the Django admin panel.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ title, value, unit, icon, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    pink: 'from-pink-500 to-pink-600'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl p-4 text-white shadow-lg`}>
      <div className="flex items-start justify-between mb-2">
        <span className="text-sm opacity-90">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm opacity-90">{unit}</span>
      </div>
    </div>
  );
}