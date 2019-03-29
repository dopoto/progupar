import {Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GithubApiService {

  constructor(private http: HttpClient) {}

  getUser(username: string) {
    const endPoint = `https://api.github.com/users/${username}`;
    this.http.get(endPoint).subscribe(data => {});
  }

  submitChange(userName: string, repoName: string) {    
    this.getMasterSha$(userName, repoName, "master").subscribe((data) => {
      const sha = data.object.sha;
      const newBranchName = new Date().getTime().toString();
      debugger;
      this.createBranch$(userName, repoName, sha, newBranchName).subscribe((createdBranchData) => {
        // commit file
        // create PR
      });
    });
  }

  getRepo$(userName: string, repoName: string): Observable<any> {
    const endPoint = `https://api.github.com/repos/${userName}/${repoName}`;
    return this.http.get(endPoint);
  }

  getMasterSha$(userName: string, repoName: string, branchName: string): Observable<any> {
    const endPoint = `https://api.github.com/repos/${userName}/${repoName}/git/refs/heads/${branchName}`;
    return this.http.get(endPoint);
  }

  createBranch$(userName: string, repoName: string, shaToBranchFrom: string, newBranchName: string): Observable<any> {
    const endPoint = `https://api.github.com/repos/${userName}/${repoName}/git/refs`;
    const headers = new HttpHeaders({
      Authorization: `token TODO USE PROUPAR TOKEN`
    });
    const postData = {
      "ref": `refs/heads/${newBranchName}`,
      "sha": shaToBranchFrom
    }
    return this.http.post(endPoint, postData, { headers });
  }

  /*
    def commit
    # Fix line endings
    @content = convert_line_endings(@content, @lineendings)
    # Do we need to work in a fork?
    forked = !github.repository(original_repo_path).permissions.push
    repo_path = forked ? user_repo_path : original_repo_path
    # Get the SHA of the edited branch - this is the head we want to add to
    base_sha = github.tree(original_repo_path, @branch, :recursive => true).sha
    # What shall we call our new branch?
    branch_name = DateTime.now.to_s(:number)
    # Update fork if appropriate by making a new branch from the upstream base SHA
    # We do this even if not forking, as there's no harm in doing so
    create_branch(repo_path, branch_name, base_sha)
    # Commit the file on our new branch
    new_branch = commit_file(repo_path, @filename, @content, @summary, base_sha, branch_name)
    # open PR
    pull_from = forked ? "#{@current_user.login}:#{new_branch}" : branch_name
    @pr = open_pr(pull_from, @branch, @summary, @description)
    # Check for CLA
    @cla_url = "https://www.clahub.com/agreements/#{original_repo_path}"
    r = Faraday.get @cla_url
    @has_cla = (r.status == 200)
  end

  def create_branch(repo, name, sha)
    branch = github.create_reference repo, "heads/#{name}", sha
    branch.ref
  end

  def update_branch(repo, name, sha)
    branch = github.update_reference repo, "heads/#{name}", sha
    branch.ref
  end

  def open_pr(head, base, title, description)
    pr = github.create_pull_request original_repo_path, base, head, title, description
    Proposal.find_or_create_by(
      number: pr.number,
      opened_at: DateTime.now,
      title: title,
      proposer: @current_user
    )
  end
  
  def commit_file(repo, name, content, message, base_sha, branch_name)    
    blob_sha = create_blob(repo, content)
    tree_sha = add_blob_to_tree(repo, blob_sha, name, base_sha)
    commit_sha = commit_sha(repo, tree_sha, message, base_sha)
    update_branch(repo, branch_name, commit_sha)
  end 
  */
}