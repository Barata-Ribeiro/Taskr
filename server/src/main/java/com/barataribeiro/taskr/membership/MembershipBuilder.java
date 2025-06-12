package com.barataribeiro.taskr.membership;

import com.barataribeiro.taskr.membership.dtos.MembershipProjectsDTO;
import com.barataribeiro.taskr.membership.dtos.MembershipUsersDTO;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class MembershipBuilder {
    private final ModelMapper modelMapper;

    public MembershipProjectsDTO toMembershipProjectsDTO(Membership membership) {
        return modelMapper.map(membership, MembershipProjectsDTO.class);
    }

    public MembershipUsersDTO toMembershipUsersDTO(Membership membership) {
        return modelMapper.map(membership, MembershipUsersDTO.class);
    }
}
