"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Heart,
  TrendingUp,
  Vote,
  Shield,
  Zap,
  Activity,
  Users,
  AlertTriangle,
  Coins,
  HeartOff,
  ExternalLink,
  Clock,
  Hash,
} from "lucide-react"

// Types for the new data structure
interface EventData {
  block: number
  event: string
  data: any
  timestamp: string
}

interface SummaryData {
  success: boolean
  data: EventData[]
}

interface ValidatorData {
  timestamp: string
  summary: SummaryData
  txHash: string
  blockNumber: number
  explorerLink: string
}

interface ApiResponse {
  success: boolean
  data: ValidatorData[]
  total: number
}

export default function ValidatorList() {
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/validators')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const getEventIcon = (event: string) => {
    if (event.includes('staking')) return <Coins className="w-4 h-4" />
    if (event.includes('session')) return <Activity className="w-4 h-4" />
    if (event.includes('imOnline')) return <Heart className="w-4 h-4" />
    if (event.includes('democracy')) return <Vote className="w-4 h-4" />
    if (event.includes('system')) return <Shield className="w-4 h-4" />
    return <Hash className="w-4 h-4" />
  }

  const getEventColor = (event: string) => {
    if (event.includes('Bonded') || event.includes('Rewarded')) return 'text-green-600'
    if (event.includes('Slashed') || event.includes('Offence')) return 'text-red-600'
    if (event.includes('HeartbeatReceived') || event.includes('AllGood')) return 'text-blue-600'
    if (event.includes('SomeOffline')) return 'text-yellow-600'
    return 'text-gray-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading validator data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">Error: {error}</p>
        </div>
      </div>
    )
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No validator data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Polkadot Validator Events</h1>
          <p className="text-gray-600">Real-time blockchain events with explorer links</p>
        </div>

        {/* Validator Events */}
        <div className="space-y-6">
          {data.data.map((validator, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              {/* Transaction Header */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <Shield className="w-6 h-6 text-pink-600" />
                  <div>
                    <h3 className="font-mono text-lg font-semibold text-gray-900">
                      Block #{validator.blockNumber}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-blue-100 text-blue-800">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimestamp(validator.timestamp)}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {validator.summary.data.length} Events
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Explorer Link */}
                <a
                  href={validator.explorerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-pink-100 hover:bg-pink-200 text-pink-800 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-medium">View on Explorer</span>
                </a>
              </div>

              {/* Events List */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700 mb-3">Recent Events:</h4>
                {validator.summary.data.slice(0, 10).map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className={`${getEventColor(event.event)}`}>
                      {getEventIcon(event.event)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900">{event.event}</span>
                        <span className="text-sm text-gray-500">Block {event.block}</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {event.data && Object.keys(event.data).length > 0 ? (
                          <span>
                            {Object.entries(event.data)
                              .slice(0, 2)
                              .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
                              .join(', ')}
                          </span>
                        ) : (
                          <span className="text-gray-400">No additional data</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction Hash */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Hash className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Transaction Hash:</span>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {validator.txHash.slice(0, 20)}...{validator.txHash.slice(-8)}
                  </code>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-8 text-center text-gray-600">
          <p>
            Showing {data.total} transaction{data.total !== 1 ? 's' : ''} •{" "}
            <span className="text-green-600 font-medium">
              {data.data.reduce((sum, v) => sum + v.summary.data.length, 0)} Total Events
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
