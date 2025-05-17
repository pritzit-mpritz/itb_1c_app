import React, { useState } from "react";
import ActorForm from "../components/actor/ActorForm";
import ActorList from "../components/actor/ActorList";

/**
 * Seite für Schauspieler-Verwaltung.
 */
const ActorPage: React.FC = () => {
    // Zustand, um nach dem Anlegen die Liste zu refreshen
    const [refreshKey, setRefreshKey] = useState(0);

    return (
        <div>
            <h1>Actor Verwaltung</h1>
            <ActorForm onSaved={() => setRefreshKey(k => k + 1)} />
            <ActorList key={refreshKey} />
        </div>
    );
};

export default ActorPage;
