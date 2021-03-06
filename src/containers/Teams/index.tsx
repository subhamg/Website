import React, {FC, ReactNode, useEffect, useState} from 'react';

import {BreadcrumbMenu, EmptyPage, FlatNavLinks, PageTitle} from 'components';
import {getTeamMembers} from 'utils/data';
import {NavOption} from 'types/option';
import {TeamMember, TeamName} from 'types/teams';

import TeamMemberCard from './TeamMemberCard';
import './Teams.scss';

const teamMembers = getTeamMembers();

const TEAM_NAME_FILTERS: NavOption[] = [
  {pathname: TeamName.all, title: 'All'},
  {pathname: TeamName.dotnetCore, title: '.NET Core'},
  {pathname: TeamName.backEndDevelopers, title: 'Back-End Developers'},
  {pathname: TeamName.community, title: 'Community'},
  {pathname: TeamName.design, title: 'Design'},
  {pathname: TeamName.devOps, title: 'DevOps'},
  {pathname: TeamName.discordManagers, title: 'Discord Managers'},
  {pathname: TeamName.frontEndDevelopers, title: 'Front-End Developers'},
  {pathname: TeamName.kotlinSDK, title: 'Kotlin SDK'},
  {pathname: TeamName.marketing, title: 'Marketing'},
  {pathname: TeamName.newUserOperations, title: 'New User Operations'},
  {pathname: TeamName.payments, title: 'Payments'},
  {pathname: TeamName.projectProposals, title: 'Project Proposals'},
  {pathname: TeamName.qa, title: 'QA'},
  {pathname: TeamName.redditModerators, title: 'Reddit Moderators'},
  {pathname: TeamName.research, title: 'Research'},
  {pathname: TeamName.security, title: 'Security'},
  {pathname: TeamName.youtube, title: 'YouTube'},
];

const TAB_OPTIONS: NavOption[] = [
  {pathname: 'members', title: 'Members'},
  {pathname: 'resources', title: 'Resources'},
];

const Teams: FC = () => {
  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>(teamMembers);
  const [teamFilter, setTeamFilter] = useState<TeamName>(TeamName.all);
  const [tabOption, setTabOption] = useState<string>('members');
  const [page, setPage] = useState<ReactNode>();

  useEffect(() => {
    const getFilteredMembers = (): TeamMember[] => {
      const teamLeads: TeamMember[] = [];
      const otherMembers: TeamMember[] = [];
      teamMembers.forEach((member) => {
        const {teams} = member;
        const matchingTeam =
          teamFilter !== 'All' ? teams.find(({title}) => title.toLowerCase() === teamFilter.toLowerCase()) : member;
        if (matchingTeam) {
          if (matchingTeam.isLead) {
            teamLeads.push({...member, isLead: true});
          } else {
            otherMembers.push({...member, isLead: false});
          }
        }
      });
      teamLeads.sort((a, b) => a.displayName.localeCompare(b.displayName));
      otherMembers.sort((a, b) => a.displayName.localeCompare(b.displayName));
      return teamLeads.concat(otherMembers);
    };

    setFilteredMembers(getFilteredMembers());
  }, [teamFilter]);

  useEffect(() => {
    const getPage = (): ReactNode => {
      return tabOption === 'members' ? (
        <div className="Teams__team-list">
          {filteredMembers.map(
            ({contributorId, displayName, githubUsername, isLead, payPerDay, profileImage, slackUsername, titles}) => (
              <TeamMemberCard
                displayName={displayName}
                githubUsername={githubUsername}
                isLead={isLead}
                key={contributorId}
                payPerDay={payPerDay}
                profileImage={profileImage}
                slackUsername={slackUsername}
                titles={titles}
              />
            ),
          )}
        </div>
      ) : (
        <p>test lol</p>
      );
    };
    setPage(getPage());
  }, [tabOption, filteredMembers, teamFilter]);

  const handleNavOptionClick = (option: TeamName) => (): void => {
    setTeamFilter(option);
  };

  const handleTabOptionClick = (option: string) => (): void => {
    setTabOption(option);
  };

  const renderTeamFilter = (): ReactNode => {
    return (
      <FlatNavLinks handleOptionClick={handleNavOptionClick} options={TEAM_NAME_FILTERS} selectedOption={teamFilter} />
    );
  };

  const renderTabOptions = (): ReactNode => {
    return (
      <FlatNavLinks
        className="Teams__tab"
        handleOptionClick={handleTabOptionClick}
        options={TAB_OPTIONS}
        selectedOption={tabOption}
      />
    );
  };

  return (
    <>
      <PageTitle title="Teams" />
      <div className="Teams">
        <BreadcrumbMenu
          className="Teams__BreadcrumbMenu"
          menuItems={renderTeamFilter()}
          pageName={teamFilter}
          sectionName="Team"
        />
        <div className="Teams__left-menu">{renderTeamFilter()}</div>
        <div className="Teams__right-list">
          <div className="Teams__top-bar">
            <h1 className="Teams__team-heading">{teamFilter === TeamName.all ? 'All' : teamFilter}</h1>
            {renderTabOptions()}
          </div>
          {!filteredMembers.length && <EmptyPage />}
          <div className="Teams__content">{page}</div>
        </div>
      </div>
    </>
  );
};

export default Teams;
