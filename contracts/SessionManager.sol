// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SessionManager
 * @dev Manages user sessions for DeFi agent tools authorization
 */
contract SessionManager {
    struct Session {
        bytes32 dataHash;      // Hash of the session data (tools list)
        uint256 expiresAt;     // Expiration timestamp
        bool isActive;         // Whether the session is active
    }
    
    // Mapping from user address to their session
    mapping(address => Session) public sessions;
    
    // Events
    event SessionRegistered(address indexed user, bytes32 dataHash, uint256 expiresAt);
    event SessionRevoked(address indexed user);
    
    /**
     * @dev Register a new session for a user
     * @param user The user address
     * @param dataHash Hash of the session data (tools list)
     * @param duration Duration of the session in seconds
     */
    function registerSession(address user, bytes32 dataHash, uint256 duration) external {
        uint256 expiresAt = block.timestamp + duration;
        
        sessions[user] = Session({
            dataHash: dataHash,
            expiresAt: expiresAt,
            isActive: true
        });
        
        emit SessionRegistered(user, dataHash, expiresAt);
    }
    
    /**
     * @dev Register a session for multiple users in a single transaction
     * @param users Array of user addresses
     * @param dataHashes Array of data hashes
     * @param durations Array of session durations
     */
    function batchRegisterSessions(
        address[] calldata users,
        bytes32[] calldata dataHashes,
        uint256[] calldata durations
    ) external {
        require(users.length == dataHashes.length && users.length == durations.length, "Array lengths must match");
        
        for (uint256 i = 0; i < users.length; i++) {
            uint256 expiresAt = block.timestamp + durations[i];
            
            sessions[users[i]] = Session({
                dataHash: dataHashes[i],
                expiresAt: expiresAt,
                isActive: true
            });
            
            emit SessionRegistered(users[i], dataHashes[i], expiresAt);
        }
    }
    
    /**
     * @dev Verify if a session is valid
     * @param user The user address
     * @param dataHash The data hash to verify
     * @return isValid Whether the session is valid
     */
    function verifySession(address user, bytes32 dataHash) external view returns (bool isValid) {
        Session memory session = sessions[user];
        
        return (
            session.isActive &&
            session.expiresAt > block.timestamp &&
            session.dataHash == dataHash
        );
    }
    
    /**
     * @dev Revoke a user's session
     * @param user The user address
     */
    function revokeSession(address user) external {
        require(sessions[user].isActive, "Session not active");
        
        sessions[user].isActive = false;
        
        emit SessionRevoked(user);
    }
    
    /**
     * @dev Get a user's session
     * @param user The user address
     * @return dataHash The session data hash
     * @return expiresAt The expiration timestamp
     * @return isActive Whether the session is active
     */
    function getSession(address user) external view returns (bytes32 dataHash, uint256 expiresAt, bool isActive) {
        Session memory session = sessions[user];
        return (session.dataHash, session.expiresAt, session.isActive);
    }
}