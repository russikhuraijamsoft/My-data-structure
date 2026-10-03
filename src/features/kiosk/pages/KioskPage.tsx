import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKioskStore } from '../store/kioskStore';
import { usePosStore } from '../../pos/store/posStore';
import { KioskWelcome } from '../components/KioskWelcome';
import { KioskMenuGrid } from '../components/KioskMenuGrid';
import { KioskBottomBar } from '../components/KioskBottomBar';
import { KioskCustomizationModal } from '../components/KioskCustomizationModal';
import { KioskCartDrawer } from '../components/KioskCartDrawer';
import { KioskPineLabsTerminal } from '../components/KioskPineLabsTerminal';
import { KioskOrderSuccess } from '../components/KioskOrderSuccess';
import { KioskHardwareFrame } from '../components/KioskHardwareFrame';
import { Loader2 } from 'lucide-react';

export function KioskPage() {
  const navigate = useNavigate();
  const { step, modalProduct, setModalProduct } = useKioskStore();
  const { products, loadProducts, loading } = usePosStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAdminExit = () => {
    navigate('/pos');
  };

  return (
    <KioskHardwareFrame>
      <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden select-none font-sans">
        {/* Step Routing */}
        {loading && products.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <Loader2 className="w-10 h-10 animate-spin text-[#800000] mb-3" />
            <span className="text-sm font-black text-[#800000] uppercase tracking-wider">
              Starting Kiosk System...
            </span>
          </div>
        ) : (
          <>
            {step === 'ATTRACT' && <KioskWelcome onAdminExit={handleAdminExit} />}
            
            {step === 'MENU' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                <KioskMenuGrid products={products} />
                <KioskBottomBar />
              </div>
            )}

            {step === 'CART' && <KioskCartDrawer products={products} />}

            {step === 'PAYMENT' && <KioskPineLabsTerminal />}

            {step === 'SUCCESS' && <KioskOrderSuccess />}
          </>
        )}

        {/* Modal Customization Layer */}
        {modalProduct && (
          <KioskCustomizationModal
            product={modalProduct}
            onClose={() => setModalProduct(null)}
          />
        )}
      </div>
    </KioskHardwareFrame>
  );
}
