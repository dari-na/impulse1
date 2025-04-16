chrome.storage.sync.get(['totalWater', 'totalCO2'], (data) => {
    document.getElementById('total-water').textContent = 
      `${data.totalWater || 0} liters`;
    document.getElementById('total-co2').textContent = 
      `${data.totalCO2 || 0} kg`;
  });