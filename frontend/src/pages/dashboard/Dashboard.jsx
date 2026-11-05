import api from "../../services/api";
import { useState,useEffect } from "react";
import { getDashboardSummary } from "../../services/propertyService";
import { handleApiError } from "../../utils/errorHandler";

const Dashboard = () => {
    const [data,setData]=useState([])
    useEffect(()=>{
        const fetch=async()=>{
            try {
                const res=await getDashboardSummary()
            setData(res.data)
            console.log(res.data)
            console.log(res)
            } catch (error) {
                handleApiError(error)
            }
        }
        fetch()
    },[])

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="border-b border-[#815854]/15 pb-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#815854]">
                    Dashboard
                </h2>
                <p className="text-[#815854]/75 font-medium mt-1 text-sm sm:text-base">
                    Welcome to the Real Estate Management System.
                </p>
            </div>
{/* {total_properties: 3, active_units: 1, current_tenants: 1, active_tenancies: 1} */}
            {/* Overview Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-[#F9EBDE] border border-[#815854]/20 p-5 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-[#815854]/70 uppercase tracking-wider">Total Properties</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#815854] mt-2">{data.total_properties || '--'}</p>
                </div>

                <div className="bg-[#F9EBDE] border border-[#815854]/20 p-5 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-[#815854]/70 uppercase tracking-wider">Active Units</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#815854] mt-2">{data.active_units || '--'}</p>
                </div>

                <div className="bg-[#F9EBDE] border border-[#815854]/20 p-5 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-[#815854]/70 uppercase tracking-wider">Current Tenants</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#815854] mt-2">{data.current_tenants || '--'}</p>
                </div>

                <div className="bg-[#F9EBDE] border border-[#815854]/20 p-5 rounded-xl shadow-sm">
                    <p className="text-xs font-semibold text-[#815854]/70 uppercase tracking-wider">Active Tenancies</p>
                    <p className="text-2xl sm:text-3xl font-bold text-[#815854] mt-2">{data.active_tenancies || '--'}</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;