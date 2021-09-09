import { ITeam } from '../../interfaces';
import { Team } from '../../../data/entities';

export const mapTeamsToITeams = (teams: Team[]): ITeam[] => {
  const teamsWithRoles = teams.map((team) => {
    const { id, name, users, owner } = team;

    const mappedUsers = users.map(
      ({ id, fullName, avatar, userWorkspaces }) => ({
        id,
        fullName,
        avatar,
        roleInWorkspace: userWorkspaces[0].role,
      }),
    );
    return { id, name, owner, users: mappedUsers };
  });

  return teamsWithRoles;
};
