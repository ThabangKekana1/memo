'use client'

import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

const SUPPLIERS = [
  {
    name: 'Step Building Supplies',
    pricePerUnit: 732.57,
    totalRevenue: 426867037,
    annualExtraction: 583145.86,
    extractionCycle: 2
  },
  {
    name: 'Inframat',
    pricePerUnit: 650,
    totalRevenue: 379044809,
    annualExtraction: 583145.86,
    extractionCycle: 2
  },
  {
    name: 'Bulkmat',
    pricePerUnit: 598,
    totalRevenue: 348305960,
    annualExtraction: 583145.86,
    extractionCycle: 2
  },
  {
    name: 'Platinum Aggregates',
    pricePerUnit: 90,
    totalRevenue: 91845563,
    annualExtraction: 583145.86,
    extractionCycle: 2
  }
]

const TOTAL_OPERATIONAL_COSTS = 140630000
const OPERATIONAL_COST_BREAKDOWN = {
  terraform1: 35206181,
  terraform2: 105426656
}

const EXTRACTION_PERIODS = {
  terraform1: 2,
  terraform2: 5
}

const COST_BREAKDOWN = [
  { name: 'Site Preparation', value: 0.1 },
  { name: 'Labour', value: 2.88 },
  { name: 'Equipment & Maintenance', value: 7.8 },
  { name: 'Transportation', value: 1.2 },
  { name: 'Environmental', value: 0.18 },
  { name: 'Permits', value: 0.002 },
  { name: 'Contingency', value: 1.02 }
]

const COLORS = ['#4299E1', '#48BB78', '#ED8936', '#9F7AEA', '#F56565', '#ED64A6', '#718096']

function EnhancedFinancialModel() {
  const [selectedSupplier, setSelectedSupplier] = useState(SUPPLIERS[0])

  const extractionProgress = useMemo(() => {
    const progress = []
    const monthlyVolumeTF1 = selectedSupplier.annualExtraction * (OPERATIONAL_COST_BREAKDOWN.terraform1 / TOTAL_OPERATIONAL_COSTS) / EXTRACTION_PERIODS.terraform1
    const monthlyVolumeTF2 = selectedSupplier.annualExtraction * (OPERATIONAL_COST_BREAKDOWN.terraform2 / TOTAL_OPERATIONAL_COSTS) / EXTRACTION_PERIODS.terraform2
    
    for (let month = 0; month < 12; month++) {
      const tf1Volume = month < EXTRACTION_PERIODS.terraform1 ? monthlyVolumeTF1 : 0
      const tf2Volume = month < EXTRACTION_PERIODS.terraform2 ? monthlyVolumeTF2 : 0
      
      progress.push({
        month: `Month ${month + 1}`,
        'Terraform 1': tf1Volume,
        'Terraform 2': tf2Volume,
        'Total Volume': tf1Volume + tf2Volume
      })
    }
    return progress
  }, [selectedSupplier])

  const priceComparison = useMemo(() => {
    return SUPPLIERS.map(supplier => ({
      name: supplier.name,
      pricePerUnit: supplier.pricePerUnit,
      totalRevenue: supplier.totalRevenue,
      profitMargin: ((supplier.totalRevenue - TOTAL_OPERATIONAL_COSTS) / supplier.totalRevenue * 100).toFixed(2)
    }))
  }, [])

  const cashFlowProjection = useMemo(() => {
    const projection = []
    const monthlyOperationalCostsTF1 = OPERATIONAL_COST_BREAKDOWN.terraform1 / EXTRACTION_PERIODS.terraform1
    const monthlyOperationalCostsTF2 = OPERATIONAL_COST_BREAKDOWN.terraform2 / EXTRACTION_PERIODS.terraform2
    
    const monthlyRevenueTF1 = selectedSupplier.totalRevenue * (OPERATIONAL_COST_BREAKDOWN.terraform1 / TOTAL_OPERATIONAL_COSTS)
    const monthlyRevenueTF2 = selectedSupplier.totalRevenue * (OPERATIONAL_COST_BREAKDOWN.terraform2 / TOTAL_OPERATIONAL_COSTS)

    for (let month = 0; month < 12; month++) {
      const inTF1Period = month < EXTRACTION_PERIODS.terraform1
      const inTF2Period = month < EXTRACTION_PERIODS.terraform2
      
      const revenue = (inTF1Period ? monthlyRevenueTF1 / EXTRACTION_PERIODS.terraform1 : 0) +
                     (inTF2Period ? monthlyRevenueTF2 / EXTRACTION_PERIODS.terraform2 : 0)
      
      const operationalCosts = (inTF1Period ? monthlyOperationalCostsTF1 : 0) +
                              (inTF2Period ? monthlyOperationalCostsTF2 : 0)

      projection.push({
        period: `Month ${month + 1}`,
        revenue,
        operationalCosts,
        netCashFlow: revenue - operationalCosts,
        isExtractionMonth: inTF1Period || inTF2Period
      })
    }
    return projection
  }, [selectedSupplier])

  return (
    <div className="p-6 space-y-8 bg-gray-900 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Enhanced Financial Model</h2>
        <div className="mb-4">
          <label htmlFor="supplier-select" className="block text-sm font-medium text-gray-300 mb-2">
            Select Pricing Scenario
          </label>
          <select 
            id="supplier-select"
            value={selectedSupplier.name}
            onChange={(e) => {
              const supplier = SUPPLIERS.find(s => s.name === e.target.value)
              setSelectedSupplier(supplier!)
            }}
            className="w-full p-2 bg-black text-white border border-white rounded-md"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none', appearance: 'none' }}
          >
            {SUPPLIERS.map(supplier => (
              <option key={supplier.name} value={supplier.name} className="bg-black">
                {supplier.name} - R{supplier.pricePerUnit}/unit
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Extraction Progress Chart */}
        <div className="bg-black border border-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Extraction Volume by Project</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={extractionProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis 
                  label={{ value: 'Volume (m³)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip formatter={(value) => [`${Number(value).toFixed(2)} m³`]} />
                <Legend />
                <Bar dataKey="Terraform 1" fill="#4299E1" stackId="a" />
                <Bar dataKey="Terraform 2" fill="#48BB78" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Comparison Chart */}
        <div className="bg-white border border-black p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-black">Pricing Scenarios Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceComparison} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
                <XAxis type="number" stroke="#000000" />
                <YAxis type="category" dataKey="name" width={100} stroke="#000000" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'pricePerUnit' ? `R${Number(value).toFixed(2)}` : 
                    name === 'profitMargin' ? `${Number(value).toFixed(2)}%` :
                    `R${Number(value).toLocaleString()}`
                  ]}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #000000' }}
                  labelStyle={{ color: '#000000' }}
                />
                <Legend wrapperStyle={{ color: '#000000' }} />
                <Bar dataKey="pricePerUnit" name="Price per Unit" fill="#4299E1" />
                <Bar dataKey="profitMargin" name="Profit Margin %" fill="#48BB78" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cash Flow Chart */}
        <div className="lg:col-span-2 bg-black border border-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Monthly Cash Flow Projection</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cashFlowProjection}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis 
                  tickFormatter={(value) => `R${(value / 1000000).toLocaleString()}M`}
                  label={{ value: 'Amount (Millions)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value) => [`R${(Number(value) / 1000000).toFixed(2)}M`]}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#4299E1" strokeWidth={2} />
                <Line type="monotone" dataKey="operationalCosts" name="Operational Costs" stroke="#48BB78" strokeWidth={2} />
                <Line type="monotone" dataKey="netCashFlow" name="Net Cash Flow" stroke="#ED8936" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4 text-white">Project Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-black border border-white p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Selected Pricing Scenario</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Price per Unit: R{selectedSupplier.pricePerUnit.toLocaleString()}</li>
              <li>Total Revenue: R{selectedSupplier.totalRevenue.toLocaleString()}</li>
              <li>Profit Margin: {((selectedSupplier.totalRevenue - TOTAL_OPERATIONAL_COSTS) / selectedSupplier.totalRevenue * 100).toFixed(2)}%</li>
            </ul>
          </div>
          <div className="bg-black border border-white p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Terraform 1</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Duration: {EXTRACTION_PERIODS.terraform1} months</li>
              <li>Operational Cost: R{OPERATIONAL_COST_BREAKDOWN.terraform1.toLocaleString()}</li>
              <li>Monthly Cost: R{(OPERATIONAL_COST_BREAKDOWN.terraform1 / EXTRACTION_PERIODS.terraform1).toLocaleString()}</li>
            </ul>
          </div>
          <div className="bg-black border border-white p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-white">Terraform 2</h4>
            <ul className="space-y-2 text-gray-300">
              <li>Duration: {EXTRACTION_PERIODS.terraform2} months</li>
              <li>Operational Cost: R{OPERATIONAL_COST_BREAKDOWN.terraform2.toLocaleString()}</li>
              <li>Monthly Cost: R{(OPERATIONAL_COST_BREAKDOWN.terraform2 / EXTRACTION_PERIODS.terraform2).toLocaleString()}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvestmentMemorandum() {
  return (
    <div className={`bg-black text-white min-h-screen ${poppins.className}`}>
      <nav className="bg-gray-900 text-white sticky top-0 z-50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2">
            {['Executive Summary', 'Introduction', 'Property Identification', 'PTO Documentation', 'Resource Valuation', 'Market Value Analysis', 'Investment Thesis', 'Financial Model', 'Project Overview', 'Revenue Analysis', 'Cost Breakdown'].map((item, index) => (
              <button key={item} onClick={() => document.getElementById(item.toLowerCase().replace(' ', '-'))?.scrollIntoView({behavior: 'smooth'})} className="bg-black border border-white text-white font-bold py-2 px-4 rounded-full hover:bg-gray-800">
                {index + 1}. {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <header className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Selemo X Investment Memorandum</h1>
          <p className="text-xl opacity-90">Phased Extraction Strategy Using Rotational Permits</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-black border border-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Projected Revenue</h3>
            <p className="text-3xl font-bold text-gray-300">R426.87M</p>
            <p className="text-sm text-gray-300">Step Building Supplies Rate</p>
          </div>
          <div className="bg-black border border-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Extraction Volume</h3>
            <p className="text-3xl font-bold text-gray-300">583,145.86 m³</p>
            <p className="text-sm text-gray-300">Combined Terraform 1 & 2</p>
          </div>
          <div className="bg-black border border-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Total Cost</h3>
            <p className="text-3xl font-bold text-gray-300">R140.63M</p>
            <p className="text-sm text-gray-300">All Phases</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div id="executive-summary" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">1. Executive Summary</h2>
          <p className="text-gray-300 mb-4">
            This valuation report provides an extensive review of Terraform 1 and Terraform 2, two strategic land holdings 
            owned by Emerg Industries (Pty) Limited in Limpopo Province. Located in the economic development corridor 
            of the Lepelle-Nkumpi District Municipality, these properties offer substantial opportunities for commercial, 
            industrial, and potential mining use, with notable value in G5 aggregate resources.
          </p>
          <p className="text-gray-300 mb-4">
            The valuation encompasses both (1) intrinsic land value based on market comparisons and (2) the estimated 
            revenue from G5 aggregate resources accessible during land preparation. This detailed analysis aims to deliver 
            clear insights to potential buyers and investors, ensuring a comprehensive understanding of the land's 
            marketability, zoning potential, and compliance requirements.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Project Highlights</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Total extractable volume: 583,145.86 m³</li>
                <li>Projected revenue: R426.87M (Step Building rate)</li>
                <li>Total operational cost: R140.63M</li>
                <li>Net projected return: R286.24M</li>
                <li>Project duration: Multiple 2-year permit cycles</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Value Drivers</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Secured PTOs and Traditional Authority approval</li>
                <li>Strategic location near major construction zones</li>
                <li>Phased extraction approach minimizing capital risk</li>
                <li>Multiple verified buyer commitments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div id="introduction" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">2. Introduction</h2>
          <h3 className="text-xl font-semibold mb-3">Purpose of the Report</h3>
          <p className="text-gray-300 mb-4">
            The primary objective of this report is to establish an accurate market valuation for the properties known as 
            Terraform 1 and Terraform 2. This valuation will serve as an asset analysis for Emerg Industries, supporting 
            strategic decision-making for commercial or industrial utilisation and facilitating communications with potential 
            investors.
          </p>
          <h3 className="text-xl font-semibold mb-3">Scope of Analysis</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Land Valuation: Assessment of the market value of each plot based on comparative land values and 
                locational advantages.</li>
            <li>Aggregate Resource Valuation: Revenue estimation from available G5 aggregates.</li>
            <li>Zoning Analysis: Review of permissions, with confirmation of commercial and industrial use rights.</li>
            <li>Risk Analysis: Detailed identification of potential risks, such as environmental or market-related 
                factors, along with mitigation strategies.</li>
          </ul>
        </div>

        {/* Property Identification */}
        <div id="property-identification" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">3. Property Identification and Geographical Context</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 1</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Stand Number: 41B Makiting Matjatji, Zebediela, Limpopo Province</li>
                <li>Location: Limpopo, proximate to main arterial roads enhancing access to industrial regions.</li>
                <li>Coordinates: -24.381996267122993, 29.327944365056723</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 2</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Stand Number: 75B Makiting Matjatji, Zebediela, Limpopo Province</li>
                <li>Location: Limpopo, similar in location to major roadways, providing strategic logistics benefits.</li>
                <li>Coordinates: -24.387299283611135, 29.326553697387162</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PTO Documentation */}
        <div id="pto-documentation" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">4. PTO Documentation and Transferability</h2>
          <h3 className="text-xl font-semibold mb-3">PTO Rights Overview</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Usage Rights: Formal permissions granted by the Tribal Council for commercial and industrial use.</li>
            <li>Transferability: Annual renewal of rights under Tribal Authority supervision, with provisions for property transfer.</li>
          </ul>
        </div>

        {/* Resource Valuation */}
        <div id="resource-valuation" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">5. Resource Valuation – G5 Aggregate Reserves</h2>
          <h3 className="text-xl font-semibold mb-3">Resource Overview</h3>
          <p className="text-gray-300 mb-4">
            The valuation of G5 aggregate resources forms a significant portion of the asset value, with the aggregate 
            quality meeting the demands of regional infrastructure projects.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 mb-4">
            <li>Material Type: G5 aggregate suitable for construction and road projects.</li>
            <li>Extraction Scope: Estimated depth of 6 metres across approximately 60% of each plot's area.</li>
          </ul>
          <h3 className="text-xl font-semibold mb-3">Aggregate Extraction Value</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-2">Terraform 1</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Estimated Volume: 167,245.92 m³</li>
                <li>Market Price: R150/m³</li>
                <li>Projected Value: R25,086,888</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Terraform 2</h4>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Estimated Volume: 415,899.94 m³</li>
                <li>Market Price: R150/m³</li>
                <li>Projected Value: R62,384,991</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Market Value Analysis */}
        <div id="market-value-analysis" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">6. Market Value Analysis for Land and Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 1</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Base Land Value: R13,937,160</li>
                <li>Infrastructure Premium: R16,027,734</li>
                <li>Aggregate Resource Value: R25,086,888</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 2</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Base Land Value: R34,658,328</li>
                <li>Infrastructure Premium: R39,857,077</li>
                <li>Aggregate Resource Value: R62,384,991</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Investment Thesis */}
        <div id="investment-thesis" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">7. Investment Thesis</h2>
          <div className="space-y-4 text-gray-300">
            <p><strong>Market Opportunity:</strong> The region faces a significant shortage of quality G5 aggregate, essential for infrastructure development and construction projects.</p>
            <p><strong>Competitive Advantage:</strong> Secured permissions and strategic location provide a strong competitive moat, while the phased approach allows for operational flexibility.</p>
            <p><strong>Risk Mitigation:</strong> The rotational permit strategy minimizes regulatory risk while maintaining consistent production volumes.</p>
            <p><strong>Financial Returns:</strong> Conservative pricing models indicate strong returns with multiple uplift opportunities through operational optimization and market pricing power.</p>
          </div>
        </div>

        {/* Financial Model */}
        <div id="financial-model" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">8. Financial Model</h2>
          <EnhancedFinancialModel />
        </div>

        {/* Project Overview */}
        <div id="project-overview" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">9. Project Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Key Authorizations</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>Permissions to Occupy (PTOs) for both sites</li>
                <li>Permission from Traditional Authority</li>
                <li>G5 aggregate extraction approval</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Operational Phasing</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-300">
                <li>1.5-hectare sections</li>
                <li>Two-year permit cycles</li>
                <li>Non-overlapping operations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Revenue Analysis */}
        <div id="revenue-analysis" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">10. Revenue Analysis</h2>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={SUPPLIERS}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `R${(value / 1000000).toFixed(2)}M`} />
                <Tooltip formatter={(value: any) => `R${(value / 1000000).toFixed(2)}M`} />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#8884d8" name="Total Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black">
                  <th className="p-3 text-left font-semibold text-white border border-white">Supplier</th>
                  <th className="p-3 text-left font-semibold text-white border border-white">Price Metric</th>
                  <th className="p-3 text-left font-semibold text-white border border-white">Combined Revenue</th>
                </tr>
              </thead>
              <tbody>
                {SUPPLIERS.map((supplier) => (
                  <tr key={supplier.name} className="border-b border-white">
                    <td className="p-3 text-white border border-white">{supplier.name}</td>
                    <td className="p-3 text-white border border-white">R{supplier.pricePerUnit.toFixed(2)} per m³</td>
                    <td className="p-3 text-white border border-white">R{supplier.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div id="cost-breakdown" className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">11. Cost Breakdown</h2>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={COST_BREAKDOWN}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {COST_BREAKDOWN.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `R${value.toFixed(2)}M`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 1</h3>
              <p className="text-lg">Total Cost: <span className="font-bold">R35,206,181</span></p>
              <p className="text-sm text-gray-300">~2.67 phases (4 hectares)</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Terraform 2</h3>
              <p className="text-lg">Total Cost: <span className="font-bold">R105,426,656</span></p>
              <p className="text-sm text-gray-300">~8 phases (12 hectares)</p>
            </div>
          </div>
        </div>

        {/* Environmental and Compliance Considerations */}
        <div className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">12. Environmental and Compliance Considerations</h2>
          <p className="text-gray-300 mb-4">
            Given the zoning and resource potential, managing environmental impacts is essential. Key aspects include:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            <li>Dust Control: Employing water suppression techniques and creating physical barriers.</li>
            <li>Noise Reduction: Limiting operational hours and using noise-dampening equipment.</li>
          </ul>
        </div>

        {/* Future Development Potential */}
        <div className="bg-black border border-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">13. Future Development Potential</h2>
          <p className="text-gray-