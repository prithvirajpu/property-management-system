import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUnit } from "../../services/unitService";

const UnitDetail = () => {
    const { unitId } = useParams();

    const [unit, setUnit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUnit = async () => {
            try {
                const response = await getUnit(unitId);
                setUnit(response.data);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load unit.");
            } finally {
                setLoading(false);
            }
        };

        fetchUnit();
    }, [unitId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <p className="text-[#815854] font-medium text-sm animate-pulse">
                    Loading unit details...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <div className="p-4 bg-rose-50 border-l-4 border-rose-600 text-rose-800 rounded-r-lg text-sm font-medium shadow-sm">
                    {error}
                </div>
            </div>
        );
    }

    if (!unit) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-0 py-6">
                <div className="p-6 bg-[#F9EBDE] border border-[#815854]/20 rounded-xl text-center text-[#815854] font-medium">
                    Unit not found.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-0 pb-8 space-y-4">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between border-b border-[#815854]/15 pb-3">
                <Link
                    to="/units"
                    className="text-xs font-semibold text-[#815854]/70 hover:text-[#815854] underline transition-colors"
                >
                    &larr; Back to Units
                </Link>

                <Link
                    to={`/units/${unit.id}/edit`}
                    className="bg-[#815854] hover:bg-[#815854]/90 text-[#F9EBDE] font-semibold px-4 py-2 rounded-md text-xs shadow-sm transition-all"
                >
                    Edit Unit
                </Link>
            </div>

            {/* Main Details Card */}
            <div className="bg-[#F9EBDE] border border-[#815854]/20 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
                {/* Title */}
                <div className="border-b border-[#815854]/15 pb-3 flex items-center justify-between">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#815854]">
                        Unit {unit.unit_number}
                    </h2>
                    <span className="bg-white border border-[#815854]/20 text-[#815854] px-3 py-1 rounded-full text-xs font-semibold">
                        {unit.unit_type}
                    </span>
                </div>

                {/* Details Section Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-[#815854]">
                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Property
                        </span>
                        <p className="font-medium text-[#815854]">{unit.property_name || unit.property}</p>
                    </div>

                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Monthly Rent
                        </span>
                        <p className="font-medium text-[#815854]">₹{unit.monthly_rent}</p>
                    </div>

                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Area
                        </span>
                        <p className="font-medium text-[#815854]">{unit.area ? `${unit.area} sq. ft.` : "N/A"}</p>
                    </div>

                    <div className="bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Floor
                        </span>
                        <p className="font-medium text-[#815854]">{unit.floor ?? "N/A"}</p>
                    </div>

                    <div className="sm:col-span-2 bg-white/60 border border-[#815854]/10 p-3.5 rounded-lg space-y-1">
                        <span className="text-[11px] font-semibold text-[#815854]/70 uppercase tracking-wider block">
                            Description
                        </span>
                        <p className="font-medium text-[#815854] leading-relaxed">
                            {unit.description || "N/A"}
                        </p>
                    </div>
                </div>

                {/* Features Section */}
                <div className="pt-2 border-t border-[#815854]/15">
                    <h3 className="font-semibold text-sm sm:text-base text-[#815854] mb-2.5">
                        Features & Amenities
                    </h3>

                    <div className="flex flex-wrap gap-2">
                        {unit.features?.length ? (
                            unit.features.map((feature) => (
                                <span
                                    key={feature}
                                    className="bg-white border border-[#815854]/20 text-[#815854] px-3 py-1 rounded-full text-xs font-medium shadow-xs"
                                >
                                    {feature}
                                </span>
                            ))
                        ) : (
                            <p className="text-xs text-[#815854]/60 italic">
                                No features added.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnitDetail;