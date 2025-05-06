import neo4j, { Driver, Session, QueryResult, Record as Neo4jRecord, Node, Relationship, Path } from 'neo4j-driver';

export class Neo4jService {
  private driver: Driver;
  private uri: string;
  private username: string;
  private password: string;
  private database: string;

  constructor(
    uri: string = process.env.NEO4J_URI || 'bolt://localhost:7687',
    username: string = process.env.NEO4J_USERNAME || 'neo4j',
    password: string = process.env.NEO4J_PASSWORD || 'password',
    database: string = process.env.NEO4J_DATABASE || 'neo4j'
  ) {
    this.uri = uri;
    this.username = username;
    this.password = password;
    this.database = database;
    this.driver = neo4j.driver(
      this.uri,
      neo4j.auth.basic(this.username, this.password, this.database)
    );

    console.log('\nNeo4jController initialized with:\n');
    console.log('URI:      ', process.env.NEO4J_URI);
    console.log('DATABASE: ', process.env.NEO4J_DATABASE); 
    console.log('USERNAME: ', process.env.NEO4J_USERNAME);
    console.log('PASSWORD: ', process.env.NEO4J_PASSWORD ? '********\n' : 'not set\n');
  }

  /**
   * Run a Cypher query
   */
  async runQuery(query: string, params: Record<string, any> = {}): Promise<any> {
    const session: Session = this.driver.session();
    try {
      const result: QueryResult = await session.run(query, params);
      return this.processResult(result);
    } catch (error) {
      console.error('Error running Cypher query:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  /**
   * Process Neo4j result into a more usable format
   */
  private processResult(result: QueryResult): any {
    const records = result.records.map((record: Neo4jRecord) => {
      const recordObj: Record<string, any> = {};
      
      for (const key of record.keys) {
        // Ensure key is a string
        const keyStr = String(key);
        const value = record.get(key);
        
        // Handle Neo4j types (Node, Relationship, etc.)
        if (value instanceof Node) {
          recordObj[keyStr] = {
            id: value.identity.toString(),
            labels: value.labels,
            properties: value.properties
          };
        } else if (value instanceof Relationship) {
          recordObj[keyStr] = {
            id: value.identity.toString(),
            type: value.type,
            properties: value.properties,
            startNodeId: value.startNodeElementId,
            endNodeId: value.endNodeElementId
          };
        } else if (value instanceof Path) {
          // Process Path objects
          recordObj[keyStr] = {
            segments: value.segments.map((segment) => ({
              start: {
                id: segment.start.identity.toString(),
                labels: segment.start.labels,
                properties: segment.start.properties
              },
              relationship: {
                id: segment.relationship.identity.toString(),
                type: segment.relationship.type,
                properties: segment.relationship.properties
              },
              end: {
                id: segment.end.identity.toString(),
                labels: segment.end.labels,
                properties: segment.end.properties
              }
            }))
          };
        } else {
          recordObj[keyStr] = value;
        }
      }
      
      return recordObj;
    });

    return {
      records,
      summary: {
        counters: result.summary.counters,
        resultAvailableAfter: result.summary.resultAvailableAfter,
        resultConsumedAfter: result.summary.resultConsumedAfter
      }
    };
  }

  /**
   * Check if the Neo4j database is available
   */
  async healthCheck(): Promise<boolean> {
    const session: Session = this.driver.session();
    try {
      await session.run('RETURN 1 AS result');
      return true;
    } catch (error) {
      console.error('Neo4j database is not available:', error);
      return false;
    } finally {
      await session.close();
    }
  }

  /**
   * Close the Neo4j driver
   */
  async close(): Promise<void> {
    await this.driver.close();
  }
}

export default Neo4jService;