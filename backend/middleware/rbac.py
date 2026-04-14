from typing import Dict

# Mocking the dynamic global state
GLOBAL_EMERGENCY_STATE = "Level 1"

def set_emergency_level(level: str):
    global GLOBAL_EMERGENCY_STATE
    GLOBAL_EMERGENCY_STATE = level
    print(f"[SYSTEM] Global Emergency Level updated to {level}")

class GoogleCloudIdentityRBAC:
    """
    A dynamic authentication and authorization middleware integrated with Google Cloud Identity.
    """
    
    def __init__(self):
        # Base roles and their base access levels
        self.role_permissions = {
            "admin": ["view_all", "manage_system", "view_vip_location"],
            "security": ["view_all", "view_vip_location"],
            "janitor": ["view_public_areas"]
        }
        
    def authorize_request(self, user_role: str, action: str) -> bool:
        """
        Check if a user is allowed to perform an action.
        Dynamically adjusts based on the global emergency state.
        """
        print(f"[RBAC] Authorizing '{user_role}' for '{action}' under state '{GLOBAL_EMERGENCY_STATE}'...")
        
        # Check static permissions
        if action in self.role_permissions.get(user_role, []):
            return True
            
        # Dynamic Emergency Override
        # If it's a Level 5 emergency, on-the-ground staff (like janitors) 
        # may need temporary access to VIP locations to aid evacuation routing.
        if GLOBAL_EMERGENCY_STATE == "Level 5":
            if action == "view_vip_location" and user_role in ["janitor", "mechanic", "staff"]:
                print(f"[RBAC] DYNAMIC OVERRIDE: Allowing '{user_role}' access to '{action}' due to Level 5 Emergency.")
                return True
                
        return False

# Example Usage
if __name__ == "__main__":
    rbac = GoogleCloudIdentityRBAC()
    
    # Normal Day
    print("Is Janitor allowed to see VIP location?", rbac.authorize_request("janitor", "view_vip_location"))
    
    # Active Shooter / Severe Fire
    set_emergency_level("Level 5")
    print("Is Janitor allowed to see VIP location?", rbac.authorize_request("janitor", "view_vip_location"))
