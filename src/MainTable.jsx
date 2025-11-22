import { useMemo, useState } from "react"
import jsonData from "./assets/jsonData"
import "./MainTable.css"

const MainTable = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedChannel, setSelectedChannel] = useState('All')
    const [selectedRegion, setSelectedRegion] = useState('All')

    const pageSize = 10

    
    const channels = useMemo(() => {
        const set = new Set(jsonData.map(d => d.channel))
        return ['All', ...Array.from(set)]
    }, [])

    const regions = useMemo(() => {
        const filtered = selectedChannel === 'All' ? jsonData : jsonData.filter(d => d.channel === selectedChannel)
        const set = new Set(filtered.map(d => d.region))
        return ['All', ...Array.from(set)]
    }, [selectedChannel])


    const filteredData = useMemo(() => {
        return jsonData.filter(d => {
            if (selectedChannel !== 'All' && d.channel !== selectedChannel) return false
            if (selectedRegion !== 'All' && d.region !== selectedRegion) return false
            return true
        })
    }, [selectedChannel, selectedRegion])

    const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize))


    if (currentPage > totalPages) setCurrentPage(totalPages)

    const displayData = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        const end = start + pageSize
        return filteredData.slice(start, end)
    }, [filteredData, currentPage])

    const goPrev = () => setCurrentPage(p => Math.max(1, p - 1))
    const goNext = () => setCurrentPage(p => Math.min(totalPages, p + 1))
    const goto = (n) => setCurrentPage(() => Math.min(Math.max(1, n), totalPages))

    const onChannelChange = (val) => {
        setSelectedChannel(val)
        setSelectedRegion('All')
        setCurrentPage(1)
    }

    const onRegionChange = (val) => {
        setSelectedRegion(val)
        setCurrentPage(1)
    }

    return (
        <div className="mt-container">
            <div className="mt-header">
                <h2 style={{margin:0}}>Marketing Dashboard Performance Optimization</h2>
                <div style={{color:'#c8ccd2ff'}}>Showing {filteredData.length} results</div>
            </div>

            <div className="mt-controls">
                <div className="control">
                    <label>Channel: </label>
                    <select value={selectedChannel} onChange={e => onChannelChange(e.target.value)}>
                        {channels.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <div className="control">
                    <label>Region: </label>
                    <select value={selectedRegion} onChange={e => onRegionChange(e.target.value)}>
                        {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                </div>
            </div>

            {displayData.length === 0 ? (
                <div className="mt-empty">No data matches your filters.</div>
            ) : (
                <table className="mt-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Channel</th>
                            <th>Region</th>
                            <th className="num">Spend</th>
                            <th className="num">Impressions</th>
                            <th className="num">Clicks</th>
                            <th className="num">Conversions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.map(row => (
                            <tr key={row.id}>
                                <td>{row.id}</td>
                                <td>{row.channel}</td>
                                <td>{row.region}</td>
                                <td className="num">${row.spend.toFixed(2)}</td>
                                <td className="num">{row.impressions.toLocaleString()}</td>
                                <td className="num">{row.clicks.toLocaleString()}</td>
                                <td className="num">{row.conversions}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <div className="mt-pagination">
                <button onClick={goPrev} disabled={currentPage===1}>Prev</button>
                <button onClick={goNext} disabled={currentPage===totalPages}>Next</button>
                <span style={{marginLeft:8}}>Page {currentPage} of {totalPages}</span>
                <span style={{marginLeft:8}}>Go to page:</span>
                <input type="number" min={1} max={totalPages} value={currentPage} onChange={e => goto(Number(e.target.value))} />
            </div>
        </div>
    )
}

export default MainTable