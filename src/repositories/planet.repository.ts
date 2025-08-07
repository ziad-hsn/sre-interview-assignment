import { getConnection } from '../db/connection';

export class PlanetRepository {

  async getPlanetDestructionStatus(planetId: string): Promise<boolean | null> {
    const client = await getConnection().connect();

    try {
      const result = await client.query(
        'SELECT destroyed FROM planet_status WHERE planet_id = $1',
        [planetId]
      );

      return result.rows.length > 0 ? result.rows[0].destroyed : null;
    } catch (error) {
      console.error(`Error getting destruction status for planet ${planetId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }

  async upsertPlanetDestructionStatus(planetId: string, destroyed: boolean): Promise<void> {
    const client = await getConnection().connect();

    try {
      await client.query(
        `INSERT INTO planet_status (planet_id, destroyed, updated_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (planet_id)
         DO UPDATE SET destroyed = $2, updated_at = NOW()`,
        [planetId, destroyed]
      );
    } catch (error) {
      console.error(`Error updating destruction status for planet ${planetId}:`, error);
      throw error;
    } finally {
      client.release();
    }
  }
}