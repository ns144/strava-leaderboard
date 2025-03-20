import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  username: string;
  profilePicture: string;
  value: number;
}

interface UserSelectorProps {
  data: User[];
  selectedUser: string;
  setSelectedUser: (user: string) => void;
}

export default function UserSelector({ data, selectedUser, setSelectedUser }: UserSelectorProps) {
  return (
    <Select value={selectedUser} onValueChange={setSelectedUser}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select User" />
      </SelectTrigger>
      <SelectContent>
        {data.map((user) => (
          <SelectItem key={user.username} value={user.username}>
            <div className="flex items-center gap-2">
              <img src={user.profilePicture} alt={user.username} className="h-6 w-6 rounded-full" />
              {user.username}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
